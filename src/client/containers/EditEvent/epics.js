/* global window */
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { GET_EVENT_BY_ID } from '../../utils/apipaths';
import { EDIT_EVENTS_FORM_SUBMIT } from './actionTypes';
import {
  submitFormSuccessEditEvents,
  submitFormErrorEditEvents,
} from './actions';

/**
 * Submits the incident to the server
 */
const submitEventEpic = action$ =>
  action$.pipe(
    ofType(EDIT_EVENTS_FORM_SUBMIT),
    mergeMap(action => ajax.patch(GET_EVENT_BY_ID, {
      eventData: JSON.stringify(action.payload.eventData),
    }, {
      'Content-Type': 'application/json',
      token: window.sessionStorage.getItem('token'),
    }).pipe(
      map(response => submitFormSuccessEditEvents(response)),
      catchError(error => of(submitFormErrorEditEvents(error))),
    )),
  );


const epics = combineEpics(submitEventEpic);

export default epics;
