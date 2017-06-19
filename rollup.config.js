const babel = require('rollup-plugin-babel');
const rollup = require('rollup');

const pkg = require('./package.json');

module.exports = {
  entry: 'src/index.js',
  moduleName: 'flucon',
  dest: pkg.main,
  useStrict: false,
  format: 'umd',
  exports: 'named',
  plugins: [
    babel({
      presets: [['env', { modules: false }]],
      exclude: 'node_modules/**',
      babelrc: false,
    }),
  ],
};
