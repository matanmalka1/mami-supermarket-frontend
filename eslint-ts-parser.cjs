// Minimal TypeScript-aware parser for ESLint without extra deps.
// Transpiles TS/TSX to JS using TypeScript, then parses with espree.
const ts = require('typescript');
const espree = require('espree');

const parseJs = (code, options = {}) =>
  espree.parse(code, {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    ...options,
  });

const transpileToJs = (code) =>
  ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      esModuleInterop: true,
    },
    reportDiagnostics: false,
  }).outputText;

module.exports = {
  parse(code, options) {
    const jsCode = transpileToJs(code);
    return parseJs(jsCode, options);
  },
  parseForESLint(code, options = {}) {
    const jsCode = transpileToJs(code);
    const ast = parseJs(jsCode, options);
    return { ast, services: {} };
  },
};
