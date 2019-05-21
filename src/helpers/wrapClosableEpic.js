import { Subject } from 'rxjs/Subject';
import { ActionsObservable } from 'redux-observable';

export default (userEpic) => {
  const inputActions = new Subject();
  const outputActions = new Subject();

  const rootEpic = (actions, ...rest) => {
    const closableActions = new ActionsObservable(inputActions);
    actions.subscribe(inputActions);
    userEpic(closableActions, ...rest).subscribe(outputActions);
    return outputActions;
  };

  rootEpic.close = (cb) => {
    inputActions.complete();
    outputActions.subscribe(null, cb, cb);
  };

  return rootEpic;
};
