/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  EVENT_FETCH_EVENT_DATA_SSR,
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_CANCEL,
  EVENT_FETCH_EVENT_DATA_FINISHED,
  EVENT_FETCH_REVERSE_GEOCODE_SSR,
  EVENT_FETCH_REVERSE_GEOCODE,
  EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
  EVENT_FETCH_DIRECTIONS,
  EVENT_FETCH_DIRECTIONS_FINISHED,
} from './actionTypes';
import { GET_EVENT_BY_ID, REVERSE_GEOCODE } from '../../utils/apipaths';

export function fetchDirections(startLat, startLon, endLat, endLon) {
  return {
    type: EVENT_FETCH_DIRECTIONS,
    payload: {
      startLat,
      startLon,
      endLat,
      endLon,
    },
  };
}
export function fetchDirectionsSuccess(payload = {}) {
  // console.log(payload);
  return {
    type: EVENT_FETCH_DIRECTIONS_FINISHED,
    payload,
  };
}
export function fetchEventData(payload = {}) {
  return {
    type: EVENT_FETCH_EVENT_DATA,
    payload,
  };
}
export function fetchEventDataFinished(payload = {}) {
  return {
    type: EVENT_FETCH_EVENT_DATA_FINISHED,
    payload,
  };
}
export function fetchEventDataCanceled(payload = {}) {
  return {
    type: EVENT_FETCH_EVENT_DATA_CANCEL,
    payload,
  };
}
export const fetchEventDataSSR = (payload = {}) => async (dispatch, getState) => {
  const apiUrl = `${GET_EVENT_BY_ID}?id=${payload.eventid}`;
  const { data } = await axios.get(apiUrl);

  dispatch({
    type: EVENT_FETCH_EVENT_DATA_SSR,
    payload,
  });

  dispatch(fetchEventDataFinished({ ...payload, ...data }));
};
export function fetchReverseGeocode(lat, lng) {
  return {
    type: EVENT_FETCH_REVERSE_GEOCODE,
    payload: {
      lat,
      lng,
    },
  };
}
export function fetchReverseGeocodeSuccess(payload = {}) {
  return {
    type: EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
    payload,
  };
}
export const fetchReverseGeocodeSSR = (lat, lng) => async (dispatch, getState) => {
  const apiUrl = `${REVERSE_GEOCODE}?lat=${lat}&long=${lng}`;
  const { data } = await axios.get(apiUrl);

  dispatch({
    type: EVENT_FETCH_REVERSE_GEOCODE_SSR,
    payload: {
      lat,
      lng,
    },
  });

  dispatch(fetchReverseGeocodeSuccess(data));
};
