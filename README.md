# chronicle

Tiny observable & high-performance state management with RxJS as first-class citizen.

[![NPM version](https://img.shields.io/npm/v/chronicle.svg)](https://www.npmjs.com/package/chronicle)
[![Build Status](https://travis-ci.org/robinvdvleuten/chronicle.svg?branch=master)](https://travis-ci.org/robinvdvleuten/chronicle)

## Installation

```
$ npm i chronicle@alpha --save
```

## Usage

```js
import { createStore } from 'chronicle';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const epic = (action$, store) =>
  action$
    .filter(action => action.type === 'DECREMENT')
    .map(() => ({ type: 'INCREMENT' }));

const store = createStore(counter, null, epic);

store.dispatch({ type: 'DECREMENT' });

// Will output 1 instead of -1
console.log(store.getState());
```

## Credits

Thanks to [Redux Observable](https://redux-observable.js.org/) for the initial inspiration and [Forbes Lindesay](https://github.com/ForbesLindesay) for donating the `chronicle` npm name.

## License

MIT © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
