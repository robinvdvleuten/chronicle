const buble = require('rollup-plugin-buble');

module.exports = {
  exports: 'named',
  plugins: [buble()],
};
