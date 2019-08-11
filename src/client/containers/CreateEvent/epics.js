/* global window */
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError, flatMap } from 'rxjs/operators';
import { REVERSE_GEOCODE, GET_EVENT_BY_ID } from '../../utils/apipaths';
import { MAP_ONCLICK } from '../../components/Map/actionTypes';
import { CREATE_EVENTS_FORM_SUBMIT } from './actionTypes';
import {
  createEventsUpdateLocationText,
  submitFormSuccessCreateEvents,
  submitFormErrorCreateEvents,
} from './actions';
import { editEventsUpdateLocationText } from '../EditEvent/actions';

/**
 * Fetches the reverse geocode of a particular point
 */
const fetchReverseGeocodeEpic = action$ =>
  action$.pipe(
    ofType(MAP_ONCLICK),
    mergeMap((action) => {
      const { lat } = action.payload;
      const { lng } = action.payload;
      const apiUrl = `${REVERSE_GEOCODE}?lat=${lat}&long=${lng}&accuracy=high`;
      return ajax
        .getJSON(apiUrl)
        .pipe(
          flatMap(response => concat(
            of(editEventsUpdateLocationText(response[0].formatted_address)),
            of(createEventsUpdateLocationText(response[0].formatted_address)),
          )),
          catchError(() => concat(
            of(createEventsUpdateLocationText('Location information is unavailable')),
            of(editEventsUpdateLocationText('Location information is unavailable')),
          )),
        );
    }),
  );

/**
 * Submits the incident to the server
 */
const submitEventEpic = action$ =>
  action$.pipe(
    ofType(CREATE_EVENTS_FORM_SUBMIT),
    mergeMap(action => ajax.post(GET_EVENT_BY_ID, {
      eventData: JSON.stringify(action.payload.eventData),
    }, {
      'Content-Type': 'application/json',
      token: window.sessionStorage.getItem('token'),
    }).pipe(
      map(response => submitFormSuccessCreateEvents(response)),
      catchError(error => of(submitFormErrorCreateEvents(error))),
    )),
  );


const epics = combineEpics(fetchReverseGeocodeEpic, submitEventEpic);

export default epics;
