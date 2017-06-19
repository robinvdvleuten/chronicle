import flucon from '../src';

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
  });
});
