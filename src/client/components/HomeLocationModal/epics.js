/* eslint-disable no-unused-vars */
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { HOME_LOCATION_SAVE_LOCATION } from './actionTypes';
import {
  saveHomeLocationError,
  saveHomeLocationSuccess,
} from './actions';
import { USER_UPDATE } from '../../utils/apipaths';

const updateHomeLocationEpic = action$ =>
  action$.pipe(
    ofType(HOME_LOCATION_SAVE_LOCATION),
    mergeMap((action) => {
      const apiUrl = `${USER_UPDATE}home_location`;
      const body = {
        home_location: JSON.stringify(action.payload),
      };
      return ajax
        .patch(apiUrl, body, {
          'Content-Type': 'application/json',
          token: window.sessionStorage.getItem('token'),
        }).pipe(
          map(response => saveHomeLocationSuccess(action.payload)),
          catchError(error => of(saveHomeLocationError(error.message))),
        );
    }),
  );

const epics = combineEpics(updateHomeLocationEpic);

export default epics;
