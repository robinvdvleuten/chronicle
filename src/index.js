export const thunk = args => store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState, args)
    : next(action);

export default (reducer, state = reducer(reducer._, {}), subscribers = []) => {
  const store = s =>
    (subscriber =>
      (subscribers.unshift(subscriber), i =>
        subscribers.splice((i = subscribers.indexOf(subscriber)), !!~i)))(
      s(store)
    );

  store.getState = () => state;

  store.dispatch = action =>
    (next =>
      subscribers.length === 0
        ? action => next(action)
        : subscribers.reduce((a, b) => next => a(b(next)))(next))(
      action => (state = reducer(state, action))
    )(action);

  return store;
};
