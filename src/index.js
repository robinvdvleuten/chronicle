export default (reducer, state = reducer(reducer._, {}), subscribers = []) => {
  const store = subscriber =>
    (subscribers.unshift(subscriber), i =>
      subscribers.splice((i = subscribers.indexOf(subscriber)), !!~i));

  store.getState = () => state;

  store.thunk = args => (action, next) =>
    typeof action === 'function'
      ? action(store.dispatch, store.getState, args)
      : next(action);

  store.dispatch = action => {
    const dispatch = (action, done) =>
      subscribers.length > 0
        ? subscribers
            .slice(1)
            .reduce(
              (next, subscriber) => action => subscriber(action, next),
              action => subscribers[0](action, done)
            )(action)
        : done(action);

    dispatch(action, action => (state = reducer(state, action)));
  };

  return store;
};
