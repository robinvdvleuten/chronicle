const buble = require('rollup-plugin-buble');

module.exports = {
  exports: 'named',
  plugins: [buble()],
  globals: {
    'rxjs/BehaviorSubject': 'BehaviorSubject',
    'rxjs/Subject': 'Subject',
    'rxjs/observable/merge': 'merge',
    'rxjs/operator/scan': 'scan',
    'rxjs/operator/startWith': 'startWith',
  },
  external: id => /^rxjs/.test(id),
};
