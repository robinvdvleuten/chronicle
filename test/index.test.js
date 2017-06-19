import flucon, { thunk } from '../src';

const increaseCounter = () => ({ dispatch }) => dispatch({ type: 'INCREMENT' });

describe('flucon', () => {
  it('should work', () => {
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

    store.dispatch(increaseCounter());

    unsubscribe();

    store.dispatch(increaseCounter());
    store.dispatch(increaseCounter());

    console.log(store.getState());
  });
});
