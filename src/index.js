export const thunk = args => store => (action, next) =>
  typeof action === 'function' ? action(store, args) : next(action);

export default (reducer, state = reducer(reducer._, {}), subscribers = []) => {
  const store = s =>
    (subscriber =>
      (subscribers.unshift(subscriber), i =>
        subscribers.splice((i = subscribers.indexOf(subscriber)), !!~i)))(
      s(store)
    );

  store.getState = () => state;

  store.dispatch = action =>
    ((action, done) =>
      subscribers.length > 0
        ? subscribers
            .slice(1)
            .reduce(
              (next, subscriber) => action => subscriber(action, next),
              action => subscribers[0](action, done)
            )(action)
        : done(action))(action, action => (state = reducer(state, action)));

  return store;
};
