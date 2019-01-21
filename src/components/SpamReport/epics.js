/* global window */
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, takeUntil, catchError, debounceTime } from 'rxjs/operators';

import {
  SPAM_REPORT_REPORT_SPAM_START,
  SPAM_REPORT_REPORT_SPAM_CANCEL,
} from './actionTypes';

import {
  reportSpamError,
  reportSpamSuccess,
} from './actions';

import { SPAM_REPORT } from '../../utils/apipaths';

const reportSpam = action$ =>
  action$.pipe(
    ofType(SPAM_REPORT_REPORT_SPAM_START),
    debounceTime(500),
    mergeMap((action) => {
      const { uuid } = action.payload;
      const apiUrl = `${SPAM_REPORT}?uuid=${uuid}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (window.sessionStorage.getItem('token')) {
        headers.token = window.sessionStorage.getItem('token');
      }

      return ajax({
        url: apiUrl,
        method: 'POST',
        headers,
      })
        .pipe(
          map(response => reportSpamSuccess(response)),
          catchError(error => of(reportSpamError(error))),
          takeUntil(action$.pipe(ofType(SPAM_REPORT_REPORT_SPAM_CANCEL))),
        );
    }),
  );

const epics = combineEpics(reportSpam);

export default epics;
