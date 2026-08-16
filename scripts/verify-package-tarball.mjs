import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [dryRunPath, packPath, tempRoot] = process.argv.slice(2);
assert.ok(dryRunPath && packPath && tempRoot, 'Se requieren metadata dry-run, metadata pack y directorio temporal');

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const dryRun = JSON.parse(fs.readFileSync(dryRunPath, 'utf8'))[0];
const packed = JSON.parse(fs.readFileSync(packPath, 'utf8'))[0];
const entrypoints = [
  'index',
  'common/index',
  'auth/index',
  'core/index',
  'employability/index',
  'crm/index',
  'catalog/index',
  'document-uploads/index',
  'documents/index',
  'matrices/index',
  'notifications/index',
  'reports/index',
  'i18n/index',
];
const requiredFiles = entrypoints.flatMap((entrypoint) => [
  `dist/${entrypoint}.js`,
  `dist/${entrypoint}.d.ts`,
]);
const dryRunFiles = new Set(dryRun.files.map(({ path: filePath }) => filePath));

for (const requiredFile of requiredFiles) {
  assert.ok(dryRunFiles.has(requiredFile), `El dry-run no incluye ${requiredFile}`);
}

const forbiddenPrefixes = ['src/', 'tests/', 'docs/', '.github/', 'scripts/'];
const forbiddenFiles = new Set([
  '.npmrc.example',
  'AGENTS.md',
  'CLAUDE.md',
  'biome.json',
  'tsconfig.json',
  'tsconfig.test.json',
  'tsconfig.typelevel.json',
  'vitest.config.ts',
]);
const packagingWarnings = dryRun.files
  .map(({ path: filePath }) => filePath)
  .filter(
    (filePath) =>
      forbiddenPrefixes.some((prefix) => filePath.startsWith(prefix)) || forbiddenFiles.has(filePath),
  );
const tarball = path.join(tempRoot, packed.filename);
assert.ok(fs.existsSync(tarball), `No se encontró el tarball ${tarball}`);

const consumer = path.join(tempRoot, 'consumer');
const zodPath = path.join(root, 'node_modules', 'zod');
assert.ok(fs.existsSync(zodPath), 'No se encontró zod local para el consumer fixture');
fs.mkdirSync(consumer, { recursive: true });

fs.writeFileSync(
  path.join(consumer, 'package.json'),
  JSON.stringify(
    {
      name: 'bopacorp-shared-phase6-consumer',
      private: true,
      type: 'module',
      dependencies: {
        '@bopacorp/shared': `file:${tarball}`,
        zod: `file:${zodPath}`,
      },
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(consumer, 'runtime.mjs'),
  `const entrypoints = ${JSON.stringify(
    Object.keys(packageJson.exports).map((entrypoint) =>
      entrypoint === '.' ? '@bopacorp/shared' : `@bopacorp/shared${entrypoint.slice(1)}`,
    ),
  )};
for (const entrypoint of entrypoints) {
  const module = await import(entrypoint);
  if (Object.keys(module).length === 0) throw new Error(entrypoint);
}
const shared = await import('@bopacorp/shared');
const result = shared.LoginRequestSchema.safeParse({ email: 'USER@bopacorp.com', password: 'Password1!' });
if (!result.success || result.data.email !== 'user@bopacorp.com') throw new Error('runtime schema check failed');
console.log(JSON.stringify({ entrypointCount: entrypoints.length, runtime: 'passed' }));
`,
);
fs.copyFileSync(path.join(root, 'tests/type-level/consumer.ts'), path.join(consumer, 'consumer.ts'));
fs.writeFileSync(
  path.join(consumer, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
        strict: true,
        noEmit: true,
        verbatimModuleSyntax: true,
        skipLibCheck: true,
      },
      include: ['consumer.ts'],
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      package: `${packageJson.name}@${packageJson.version}`,
      dryRunEntryCount: dryRun.files.length,
      requiredFiles: requiredFiles.length,
      tarball,
      packagingWarnings,
      consumerFixture: consumer,
    },
    null,
    2,
  ),
);
