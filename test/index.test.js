import reduxThunk from 'redux-thunk';
import reduxSaga from 'redux-saga';
import chronicle from '../src';
import todos, { addTodo, addTodoAsync } from './helpers/todos';

const unknownAction = () => ({ type: 'UNKNOWN' });

describe('chronicle', () => {
  it('applies the reducer to the previous state', () => {
    const store = chronicle(todos);
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

  it('applies the reducer to the initial state', () => {
    const store = chronicle(todos, [
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

  it('supports multiple subscriptions', () => {
    const store = chronicle(todos);
    const listenerA = jest.fn(next => action => next(action));
    const listenerB = jest.fn(next => action => next(action));

    let unsubscribeA = store(() => listenerA);
    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(0);

    const unsubscribeB = store(() => listenerB);
    expect(listenerA.mock.calls.length).toBe(2);
    expect(listenerB.mock.calls.length).toBe(0);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    unsubscribeA();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeB();
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    unsubscribeA = store(() => listenerA);
    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(2);

    store.dispatch(unknownAction());
    expect(listenerA.mock.calls.length).toBe(4);
    expect(listenerB.mock.calls.length).toBe(2);
  });

  it('supports redux-thunk middleware', () => {
    const store = chronicle(todos);
    store(reduxThunk);

    store.dispatch(addTodoAsync('Hello'));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
    ]);
  });

  it('supports redux-saga middleware', () => {
    const saga = reduxSaga();

    const store = chronicle(todos);
    store(saga);

    store.dispatch(addTodo('Hello'));
    expect(store.getState()).toEqual([
      {
        id: 1,
        text: 'Hello',
      },
    ]);
  });
});
