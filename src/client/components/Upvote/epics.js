/* global window */
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, takeUntil, catchError, debounceTime } from 'rxjs/operators';

import {
  FETCH_UPVOTES_START,
  FETCH_UPVOTES_CANCEL,
  UPDATE_UPVOTE_START,
  UPDATE_UPVOTE_CANCEL,
} from './actionTypes';

import {
  fetchUpvotesSuccess,
  updateUpvoteSuccess,
  fetchUpvotesError,
  upvoteUpvoteError,
} from './actions';

import { UPVOTE } from '../../utils/apipaths';

const fetchUpvoteEpic = action$ =>
  action$.pipe(
    ofType(FETCH_UPVOTES_START),
    mergeMap((action) => {
      const { uuid, currentCount, initialRequest } = action.payload;
      let apiUrl = `${UPVOTE}?uuid=${uuid}`;
      if (!initialRequest) {
        apiUrl += `&current_count=${currentCount}`;
      }
      const headers = {
        'Content-Type': 'application/json',
      };
      if (window.sessionStorage.getItem('token')) {
        headers.token = window.sessionStorage.getItem('token');
      }
      return ajax({
        url: apiUrl,
        method: 'GET',
        headers,
      })
        .pipe(
          map(response => fetchUpvotesSuccess(response)),
          catchError(error => of(fetchUpvotesError(error))),
          takeUntil(action$.pipe(ofType(FETCH_UPVOTES_CANCEL))),
        );
    }),
  );

const updateUpvoteEpic = action$ =>
  action$.pipe(
    ofType(UPDATE_UPVOTE_START),
    debounceTime(500),
    mergeMap((action) => {
      const { uuid } = action.payload;
      const apiUrl = `${UPVOTE}?uuid=${uuid}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      headers.token = window.sessionStorage.getItem('token');

      return ajax({
        url: apiUrl,
        method: 'POST',
        headers,
      })
        .pipe(
          map(response => updateUpvoteSuccess(response)),
          catchError(error => of(upvoteUpvoteError(error))),
          takeUntil(action$.pipe(ofType(UPDATE_UPVOTE_CANCEL))),
        );
    }),
  );

const epics = combineEpics(fetchUpvoteEpic, updateUpvoteEpic);

export default epics;
