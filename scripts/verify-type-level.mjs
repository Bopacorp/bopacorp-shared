import assert from 'node:assert/strict';
import ts from 'typescript';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'tsconfig.typelevel.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
assert.equal(config.error, undefined, 'No se pudo leer tsconfig.typelevel.json');
const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const compilerOptions = {
  ...parsedConfig.options,
  noEmit: true,
};

const diagnosticsFor = (rootNames, options = compilerOptions) => {
  const program = ts.createProgram({ rootNames, options });
  return ts.getPreEmitDiagnostics(program);
};

const formatDiagnostics = (diagnostics) =>
  ts.flattenDiagnosticMessageText(
    diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'),
    '\n',
  );

const validDiagnostics = diagnosticsFor(parsedConfig.fileNames);
assert.equal(
  validDiagnostics.length,
  0,
  `El fixture válido no compila:\n${formatDiagnostics(validDiagnostics)}`,
);

const invalidPath = path.join(root, 'tests/type-level/invalid-consumer.ts');
const invalidDiagnostics = diagnosticsFor([invalidPath]);
const invalidOutput = formatDiagnostics(invalidDiagnostics);

assert.ok(invalidDiagnostics.length > 0, 'El fixture inválido compiló y no detectó el campo desconocido');
assert.match(invalidOutput, /notAContractField/u, 'El error no identifica el campo inválido esperado');

console.log(
  JSON.stringify(
    {
      validFixture: 'passed',
      invalidFixture: 'rejected as expected',
    },
    null,
    2,
  ),
);
