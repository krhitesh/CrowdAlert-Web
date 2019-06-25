import { ajax } from 'rxjs/observable/dom/ajax';
import { ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, takeUntil } from 'rxjs/operators';
import {
  fetchEventDataFinished,
  fetchReverseGeocodeSuccess,
  fetchDirectionsSuccess,
} from './actions';

import {
  GET_EVENT_BY_ID,
  REVERSE_GEOCODE,
  GET_DIRECTIONS,
} from '../../utils/apipaths';

import {
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_CANCEL,
  EVENT_FETCH_REVERSE_GEOCODE,
  EVENT_FETCH_DIRECTIONS,
} from './actionTypes';

const fetchEventDataEpic = action$ =>
  action$.pipe(
    ofType(EVENT_FETCH_EVENT_DATA),
    mergeMap((action) => {
      const { payload } = action;
      const apiUrl = `${GET_EVENT_BY_ID}?id=${payload.eventid}`;
      console.log(apiUrl);
      return ajax
        .getJSON(apiUrl)
        .pipe(
          map(response => fetchEventDataFinished({ ...payload, ...response })),
          takeUntil(action$.pipe(ofType(EVENT_FETCH_EVENT_DATA_CANCEL))),
        );
    }),
  );

const fetchReverseGeocodeEpic = action$ =>
  action$.pipe(
    ofType(EVENT_FETCH_REVERSE_GEOCODE),
    mergeMap((action) => {
      const { lat, lng } = action.payload;
      const apiUrl = `${REVERSE_GEOCODE}?lat=${lat}&long=${lng}`;
      return ajax
        .getJSON(apiUrl)
        .pipe(map(response => fetchReverseGeocodeSuccess(response)));
    }),
  );

const fetchDirections = action$ =>
  action$.pipe(
    ofType(EVENT_FETCH_DIRECTIONS),
    mergeMap((action) => {
      const {
        startLat, startLon, endLat, endLon,
      } = action.payload;
      const apiUrl = `${GET_DIRECTIONS}?startLat=${startLat}&startLong=${startLon}&endLat=${endLat}&endLong=${endLon}`;
      return ajax
        .getJSON(apiUrl)
        .pipe(map(response => fetchDirectionsSuccess(response)));
    }),
  );

const epics = combineEpics(fetchEventDataEpic, fetchReverseGeocodeEpic, fetchDirections);

export default epics;
