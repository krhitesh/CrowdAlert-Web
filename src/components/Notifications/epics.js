import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { NOTIFICATIONS_SEND_TOKEN_TO_SERVER } from './actionTypes';
import {
  sendFCMTokenToServerSuccess,
  sendFCMTokenToServerError,
} from './actions';
import { FCM_TOKEN } from '../../utils/apipaths';

const sendFCMKeyEpic = action$ =>
  action$.pipe(
    ofType(NOTIFICATIONS_SEND_TOKEN_TO_SERVER),
    mergeMap((action) => {
      const { fcmtoken } = action.payload;
      const apiUrl = `${FCM_TOKEN}`;
      return ajax
        .post(apiUrl, {
          fcmtoken,
        }, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        })
        .pipe(
          map(response => sendFCMTokenToServerSuccess(response)),
          catchError(error => of(sendFCMTokenToServerError(error))),
        );
    }),
  );

const epics = combineEpics(sendFCMKeyEpic);

export default epics;
