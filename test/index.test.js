import { Subject } from 'rxjs/Subject';
import todos, { addTodo } from './helpers/todos';
import { createStore, combineEpics } from '../src';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/map';

const unknownAction = () => ({ type: 'UNKNOWN' });

describe('chronicle', () => {
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

  it('should combine multiple epics', () => {
    expect.assertions(1);

    const epicFoo = (action$, store) =>
      action$
        .filter(action => action.type === 'ACTION_FOO')
        .map(action => ({ type: 'RESOLVED_FOO', action, store }));

    const epicBar = (action$, store) =>
      action$
        .filter(action => action.type === 'ACTION_BAR')
        .map(action => ({ type: 'RESOLVED_BAR', action, store }));

    const epic = combineEpics(epicFoo, epicBar);

    const action$ = new Subject();
    const store = { I: 'am', a: 'store' };

    const actions = [];

    const result = epic(action$, store);
    result.subscribe(action => actions.push(action));

    action$.next({ type: 'ACTION_FOO' });
    action$.next({ type: 'ACTION_BAR' });

    expect(actions).toEqual([
      { type: 'RESOLVED_FOO', action: { type: 'ACTION_FOO' }, store },
      { type: 'RESOLVED_BAR', action: { type: 'ACTION_BAR' }, store },
    ]);
  });
});
