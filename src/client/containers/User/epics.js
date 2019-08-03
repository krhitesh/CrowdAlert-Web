import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, takeUntil, debounceTime, catchError } from 'rxjs/operators';

import { USER_UPDATE_USER_DATA, USER_DELETE_USER, USER_UPDATE_USER_CREDENTIALS, USER_GET_INFO } from './actionTypes';
import {
  updateUserDataSuccess,
  updateUserDataError,
  deleteUserSuccess,
  deleteUserFailed,
  updateUserCredentialsSuccess,
  updateUserCredentialsFailed,
  userGetInfoFailed,
  userGetInfoSuccess,
} from './actions';
import { USER_PROFILES, USER_DELETE, USER_UPDATE } from '../../utils/apipaths';

const getUserInfoEpic = action$ =>
  action$.pipe(
    ofType(USER_GET_INFO),
    mergeMap((action) => {
      const apiUrl = `${USER_PROFILES}?key=${action.payload.key}`;
      return ajax
        .get(apiUrl, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        }).pipe(
          map(response => userGetInfoSuccess(response.response)),
          catchError(error => of(userGetInfoFailed(error.message))),
        );
    }),
  );

const userUpdateCredentialsEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE_USER_CREDENTIALS),
    mergeMap((action) => {
      const apiUrl = USER_UPDATE;
      let values = '';
      const body = {};
      if (action.payload.email !== null) {
        values = 'email';
        body.email = action.payload.email;
      }
      if (action.payload.password !== null) {
        if (values !== '') values += '&';
        values += 'password';
        body.password = action.payload.password;
      }
      return ajax
        .patch(apiUrl + values, body, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        }).pipe(
          map(response => updateUserCredentialsSuccess(response)),
          catchError(error => of(updateUserCredentialsFailed(error.message))),
        );
    }),
  );

const userDeleteUserEpic = action$ =>
  action$.pipe(
    ofType(USER_DELETE_USER),
    mergeMap(() => {
      const apiUrl = USER_DELETE;
      return ajax
        .delete(apiUrl, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        }).pipe(
          map(response => deleteUserSuccess(response)),
          catchError(error => of(deleteUserFailed(error.message))),
        );
    }),
  );

const userProfileUpdaterEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE_USER_DATA),
    mergeMap((action) => {
      const apiUrl = USER_PROFILES;
      return ajax
        .post(apiUrl, {
          userData: JSON.stringify(action.payload.userData),
        }, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        }).pipe(
          map(response => updateUserDataSuccess(response)),
          catchError(error => of(updateUserDataError(error))),
        );
    }),
  );

const epics = combineEpics(userProfileUpdaterEpic, userDeleteUserEpic, userUpdateCredentialsEpic, getUserInfoEpic);

export default epics;
