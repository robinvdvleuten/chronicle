# flucon

Tiny observable state management.

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

const unsubscribe = store((action, next) => {
  console.log(action);
  return next(action);
});

store.dispatch({ type: 'INCREMENT' });

unsubscribe();

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });

console.log(store.getState());
```

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
