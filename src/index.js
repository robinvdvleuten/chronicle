import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { scan } from 'rxjs/operator/scan';
import { startWith } from 'rxjs/operator/startWith';

exports.combineEpics = function() {
  const epics = [].slice.call(arguments);

  return function() {
    const args = [].slice.call(arguments);

    return merge.apply(
      null,
      epics.map(function(epic) {
        return epic.apply(null, args);
      })
    );
  };
};

exports.createStore = function(
  reducer,
  state = reducer(reducer._, {}),
  rootEpic,
  options = {}
) {
  const store$ = new BehaviorSubject();
  const action$ = new Subject();

  scan.call(startWith.call(action$, state), reducer).subscribe(store$);

  const getState = function() {
    return store$.getValue();
  };

  const dispatch = function(action) {
    action$.next(action);
  };

  if (typeof rootEpic === 'function') {
    'dependencies' in options
      ? rootEpic(action$, { getState }, options.dependencies).subscribe(
          dispatch
        )
      : rootEpic(action$, { getState }).subscribe(dispatch);
  }

  return { getState, dispatch };
};
