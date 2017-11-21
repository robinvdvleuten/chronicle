import todos, { addTodo } from './helpers/todos';
import { createStore, combineEpics } from '../src';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/map';

const unknownAction = () => ({ type: 'UNKNOWN' });

describe('createStore', () => {
  it('should apply the reducer to the previous state', () => {
    const store = createStore(todos);
    expect(store.getState()).toEqual([]);

    store.dispatch(unknownAction());
    expect(store.getState()).toEqual([]);

    store.dispatch(addTodo('Hello'));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
    ]);

    store.dispatch(addTodo('World'));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
      {
        id: 2,
        text: 'World',
      },
    ]);
  });

  it('should apply the reducer to the initial state', () => {
    const store = createStore(todos, [
      {
        id: 1,
        text: 'Hello',
      },
    ]);
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
    ]);

    store.dispatch(unknownAction());
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
    ]);

    store.dispatch(addTodo('World'));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
      {
        id: 2,
        text: 'World',
      },
    ]);
  });

  it('should subscribe epics to the action$', done => {
    expect.assertions(1);

    const epic = action$ =>
      action$
        .do(action => {
          expect(action).toEqual({ type: 'EPIC' });
          done();
        })
        .ignoreElements();

    const store = createStore(todos, {}, epic);

    store.dispatch({ type: 'EPIC' });
  });
});

describe('combineEpics', () => {
  it('should combine multiple epics', () => {
    const epicFoo = (action$, store) =>
      action$
        .filter(action => action.type === 'ACTION_FOO')
        .map(action => ({ type: 'RESOLVED_FOO', action, store }));

    const epicBar = (action$, store) =>
      action$
        .filter(action => action.type === 'ACTION_BAR')
        .map(action => ({ type: 'RESOLVED_BAR', action, store }));

    const actions = [];

    const epic = (action$, store) => {
      action$.subscribe(action => actions.push(action));
      return combineEpics(epicFoo, epicBar)(action$, store);
    };

    const store = createStore(() => {}, undefined, epic);

    store.dispatch({ type: 'ACTION_FOO' });
    store.dispatch({ type: 'ACTION_BAR' });

    expect(actions).toEqual([
      { type: 'ACTION_FOO' },
      {
        type: 'RESOLVED_FOO',
        action: { type: 'ACTION_FOO' },
        store: { getState: store.getState },
      },
      { type: 'ACTION_BAR' },
      {
        type: 'RESOLVED_BAR',
        action: { type: 'ACTION_BAR' },
        store: { getState: store.getState },
      },
    ]);
  });

  it('should pass dependencies to epics', done => {
    expect.assertions(1);

    const expected = { We: 'are', the: 'dependencies' };

    const epic = (action$, store, dependencies) =>
      action$
        .do(() => {
          expect(dependencies).toEqual(expected);
          done();
        })
        .ignoreElements();

    const store = createStore(todos, {}, epic, { dependencies: expected });

    store.dispatch({ type: 'EPIC' });
  });
});
