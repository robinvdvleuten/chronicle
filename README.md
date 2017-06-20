# flucon

Tiny observable & high-performance state management.

[![Build Status](https://travis-ci.org/robinvdvleuten/flucon.svg?branch=master)](https://travis-ci.org/robinvdvleuten/flucon)

## Installation

```
$ yarn add flucon
```

Alternatively using npm:

```
$ npm i flucon --save
```

## Usage

```js
import flucon, { thunk } from 'flucon';

const ACTIONS = {
  INCREMENT: state => ({ counter: state.counter + 1 }),
  DECREMENT: state => ({ counter: state.counter - 1 }),
};

const store = flucon(
  (state = { counter: 0 }, action) =>
    action && ACTIONS[action.type]
      ? ACTIONS[action.type](state, action)
      : state
);

store(thunk());

const unsubscribe = store(() => (action, next) => {
  console.log(action);
  return next(action);
});

store.dispatch(dispatch => dispatch({ type: 'INCREMENT' }));

unsubscribe();

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });

console.log(store.getState());
```

## Performance

You can run the performance test through `yarn test:perf`;

```bash
flucon x 760,828 ops/sec ±11.53% (56 runs sampled)
flucon with thunk x 344,415 ops/sec ±4.11% (43 runs sampled)
redux x 562,143 ops/sec ±1.22% (89 runs sampled)
redux with thunk x 247,797 ops/sec ±14.79% (77 runs sampled)
Fastest is flucon
```

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
