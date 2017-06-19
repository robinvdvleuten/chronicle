# flucon

Tiny observable & high-performance state management.

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

store(store.thunk());

const unsubscribe = store((action, next) => {
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
flucon x 634,920 ops/sec ±3.36% (61 runs sampled)
flucon with thunk x 277,866 ops/sec ±2.99% (43 runs sampled)
redux x 564,638 ops/sec ±2.03% (89 runs sampled)
redux with thunk x 205,052 ops/sec ±3.15% (83 runs sampled)
Fastest is flucon
```

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
