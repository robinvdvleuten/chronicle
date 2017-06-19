const Benchmark = require('benchmark');
const flucon = require('../../dist/flucon');
const redux = require('redux');
const thunk = require('redux-thunk').default;

const suite = Benchmark.Suite('dispatch');

const increaseCounter = suite
  .add('flucon', () => {
    flucon.default(state => state).dispatch({ type: 'INCREMENT' });
  })
  .add('flucon with thunk', () => {
    const store = flucon.default(state => state);
    store(flucon.thunk());

    store.dispatch(() => ({ dispatch }) => dispatch({ type: 'INCREMENT' }));
  })
  .add('redux', () => {
    redux.createStore(state => state).dispatch({ type: 'INCREMENT' });
  })
  .add('redux with thunk', () => {
    redux
      .createStore(state => state, redux.applyMiddleware(thunk))
      .dispatch(() => dispatch => dispatch({ type: 'INCREMENT' }));
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ minSamples: 1000 });
