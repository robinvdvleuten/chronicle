# chronicle

Tiny observable & high-performance state management.

[![Build Status](https://travis-ci.org/robinvdvleuten/chronicle.svg?branch=master)](https://travis-ci.org/robinvdvleuten/chronicle)

## Installation

```
$ npm i chronicle --save
```

## Usage

```js
import chronicle, { thunk } from 'chronicle';

const ACTIONS = {
  INCREMENT: state => ({ counter: state.counter + 1 }),
  DECREMENT: state => ({ counter: state.counter - 1 }),
};

const store = chronicle(
  (state = { counter: 0 }, action) =>
    action && ACTIONS[action.type]
      ? ACTIONS[action.type](state, action)
      : state
);

store(thunk());

const unsubscribe = store(({ dispatch }) => next => action => {
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

You can run the performance test through `npm run test:perf`;

```bash
chronicle x 892,393 ops/sec ±4.99% (66 runs sampled)
chronicle with thunk x 332,470 ops/sec ±3.61% (49 runs sampled)
redux x 557,308 ops/sec ±1.63% (89 runs sampled)
redux with thunk x 288,050 ops/sec ±1.25% (90 runs sampled)
Fastest is chronicle
```

## Credits

Thanks Forbes Lindesay for donating the `chronicle` npm name.

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
