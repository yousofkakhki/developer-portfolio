const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { transformSync } = require('next/dist/build/swc');

function loadCareerFacts(root) {
  const filename = path.join(root, 'utils/data/career-facts.js');
  const source = fs.readFileSync(filename, 'utf8');
  const transformed = transformSync(source, {
    filename,
    jsc: {
      parser: { syntax: 'ecmascript' },
      target: 'es2020',
    },
    module: { type: 'commonjs' },
  });
  const careerModule = new Module(filename);
  careerModule.filename = filename;
  careerModule.paths = Module._nodeModulePaths(path.dirname(filename));
  careerModule._compile(transformed.code, filename);
  return careerModule.exports.careerFacts;
}

module.exports = { loadCareerFacts };
