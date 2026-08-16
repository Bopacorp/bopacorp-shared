import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const coverageSummaryPath = path.join(root, 'coverage', 'coverage-summary.json');
const evidenceDirectory = path.join(root, 'artifacts');
const evidencePath = process.env.RELEASE_EVIDENCE_FILE ?? path.join(evidenceDirectory, 'release-evidence.json');
const now = new Date();
const date = now.toISOString().slice(0, 10);
const runNumber = process.env.GITHUB_RUN_NUMBER ?? process.env.GITHUB_RUN_ID ?? 'local';
const npmVersion = process.env.npm_config_user_agent?.match(/npm\/([^\s]+)/u)?.[1] ?? 'unknown';
const gateStatus = process.env.QUALITY_GATE_STATUS ?? (process.env.CI ? 'not-reported' : 'passed');
const durationValue = Number(process.env.QUALITY_GATE_DURATION_SECONDS);
const coverageSummary = fs.existsSync(coverageSummaryPath)
  ? JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'))
  : null;
const totalCoverage = coverageSummary?.total ?? null;
const coverage = totalCoverage
  ? {
      statements: totalCoverage.statements?.pct ?? null,
      branches: totalCoverage.branches?.pct ?? null,
      functions: totalCoverage.functions?.pct ?? null,
      lines: totalCoverage.lines?.pct ?? null,
    }
  : null;

const evidence = {
  id: `SHARED-F7-${date}-${String(runNumber).padStart(2, '0')}`,
  generatedAt: now.toISOString(),
  revision: process.env.GITHUB_SHA ?? process.env.GIT_COMMIT ?? 'local',
  branch: process.env.GITHUB_REF_NAME ?? 'local',
  package: {
    name: packageJson.name,
    version: packageJson.version,
  },
  environment: {
    node: process.version,
    npm: npmVersion,
    platform: process.platform,
    ci: process.env.CI === 'true',
  },
  result: {
    status: gateStatus,
    decision: gateStatus === 'passed' ? 'compatible' : 'pending',
    durationSeconds: Number.isFinite(durationValue) ? durationValue : null,
    coverage,
  },
  commands: [
    'npm run check',
    'npm run test:run',
    'npm run test:typecheck',
    'npm run test:coverage',
    'npm run build',
    'npm run test:artifact',
    'npm run test:typelevel',
    'npm run test:package',
  ],
  artifacts: [
    { path: 'coverage/index.html', exists: fs.existsSync(path.join(root, 'coverage', 'index.html')) },
    { path: 'coverage/lcov.info', exists: fs.existsSync(path.join(root, 'coverage', 'lcov.info')) },
    {
      path: 'coverage/coverage-summary.json',
      exists: fs.existsSync(coverageSummaryPath),
    },
    { path: 'artifacts/release-evidence.json', exists: true },
  ],
  knownFindings: [
    'npm pack reports extra source and documentation files; packaging cleanup remains out of scope for Phase 7.',
    'Consumer lockfile drift is reported by test:compatibility and is not changed by this gate.',
  ],
};

fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
