import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharedPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const consumers = [
  { name: 'bopacorp-api', directory: '../bopacorp-api' },
  { name: 'bopacorp-web', directory: '../bopacorp-web' },
  { name: 'bopacorp-crm', directory: '../bopacorp-crm' },
  { name: 'bopacorp-mobile', directory: '../bopacorp-mobile' },
];

const dependencySpec = (packageJson) =>
  packageJson.dependencies?.['@bopacorp/shared'] ??
  packageJson.devDependencies?.['@bopacorp/shared'] ??
  packageJson.optionalDependencies?.['@bopacorp/shared'] ??
  null;

const readJson = (filePath) => {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const packageLockEvidence = (lock) => {
  const rootPackage = lock?.packages?.[''];
  const installed = lock?.packages?.['node_modules/@bopacorp/shared'];
  return {
    specifier: rootPackage?.dependencies?.['@bopacorp/shared'] ?? null,
    version: installed?.version ?? null,
    resolved: installed?.resolved ?? null,
    localLink: installed?.link === true || installed?.resolved === '../bopacorp-shared',
  };
};

const pnpmEvidence = (contents) => {
  const importer = contents.match(
    /['"]@bopacorp\/shared['"]:\s*\n\s+specifier:\s*([^\n]+)\n\s+version:\s*([^\n]+)/u,
  );
  const packageEntry = contents.match(/^\s{2}['"]@bopacorp\/shared@([^'"]+)['"]:/mu);
  return {
    specifier: importer?.[1]?.trim() ?? null,
    version: importer?.[2]?.trim() ?? packageEntry?.[1] ?? null,
    resolved: packageEntry?.[1] ? 'pnpm registry entry' : null,
    localLink: false,
  };
};

const results = consumers.map(({ name, directory }) => {
  const consumerRoot = path.resolve(root, directory);
  const packagePath = path.join(consumerRoot, 'package.json');
  if (!fs.existsSync(packagePath)) {
    return { name, status: 'missing', directory };
  }

  const packageJson = readJson(packagePath);
  const lockPath = path.join(consumerRoot, 'package-lock.json');
  const pnpmLockPath = path.join(consumerRoot, 'pnpm-lock.yaml');
  const lockfiles = [];
  if (fs.existsSync(lockPath)) {
    lockfiles.push({ file: path.basename(lockPath), ...packageLockEvidence(readJson(lockPath)) });
  }
  if (fs.existsSync(pnpmLockPath)) {
    lockfiles.push({
      file: path.basename(pnpmLockPath),
      ...pnpmEvidence(fs.readFileSync(pnpmLockPath, 'utf8')),
    });
  }
  const observedVersions = lockfiles.map(({ version }) => version).filter(Boolean);
  const versionDrift = observedVersions.some((version) => version !== sharedPackage.version);
  const localLink = lockfiles.some(({ localLink: isLocalLink }) => isLocalLink);

  return {
    name,
    status: 'found',
    packageVersion: packageJson.version,
    declared: dependencySpec(packageJson),
    lockfiles,
    localLink,
    versionDrift,
  };
});

console.log(
  JSON.stringify(
    {
      shared: {
        name: sharedPackage.name,
        version: sharedPackage.version,
      },
      consumers: results,
      driftDetected: results.some((result) => result.versionDrift || result.localLink),
      note: 'La compatibilidad se reporta; este comando no modifica consumidores ni lockfiles.',
    },
    null,
    2,
  ),
);
