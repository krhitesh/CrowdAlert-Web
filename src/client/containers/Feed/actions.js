/* eslint-disable no-unused-vars */
import axios from 'axios';
import { GET_EVENTS_BY_LOCATION, GET_LOCATION_BY_IP } from '../../utils/apipaths';
import {
  WS_FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_USER_LOCATION,
  FEED_FETCH_USER_LOCATION_FINISHED,
  FEED_FETCH_USER_LOCATION_CANCEL,
  FEED_FETCH_USER_LOCATION_SSR,
  FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
  FEED_FETCH_EVENTS_BY_LOCATION_SSR,
} from './actionTypes';

export function fetchUserLocation(payload = {}) {
  return {
    type: FEED_FETCH_USER_LOCATION,
    payload,
  };
}
export function fetchUserLocationFinished(payload = {}) {
  return {
    type: FEED_FETCH_USER_LOCATION_FINISHED,
    payload,
  };
}
export const fetchUserLocationSSR = (payload = {}, ip) => async (dispatch, getState) => {
  const { data } = await axios({
    method: 'get',
    url: GET_LOCATION_BY_IP,
    headers: { 'x-forwarded-for': ip },
  });

  dispatch({
    type: FEED_FETCH_USER_LOCATION_SSR,
    payload,
  });

  dispatch(fetchUserLocationFinished({ ...payload, ...data }));
};
export function fetchEventsByLocationOverWebSocket(payload = {}) {
  return {
    type: WS_FEED_FETCH_EVENTS_BY_LOCATION,
    payload,
  };
}
export function fetchUserLocationCancel(payload = {}) {
  return {
    type: FEED_FETCH_USER_LOCATION_CANCEL,
    payload,
  };
}
export function fetchEventsByLocation(payload = {}) {
  return {
    type: FEED_FETCH_EVENTS_BY_LOCATION,
    payload,
  };
}
export function fetchEventsByLocationFinished(payload = {}) {
  return {
    type: FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
    payload,
  };
}
export const fetchEventsByLocationSSR = (payload = {}) => async (dispatch, getState) => {
  let maxPixels = 1920;
  try {
    maxPixels = Math.max(window.innerHeight, window.innerWidth);
  } catch (error) {
    maxPixels = 1920;
  }
  const { lat, lng, zoom } = payload;
  const MPP = ((156543.03392 * Math.cos((lat * Math.PI) / 180)) / (2 ** zoom));
  const distance = Math.ceil(((MPP) * maxPixels) / 1000) + 1;
  const apiUrl =
  `${GET_EVENTS_BY_LOCATION}?lat=${lat}&long=${lng}&dist=${distance}&min=${MPP * 0.04}`;

  const response = await axios.get(apiUrl);
  dispatch({
    type: FEED_FETCH_EVENTS_BY_LOCATION_SSR,
    payload,
  });

  dispatch(fetchEventsByLocationFinished({ payload, response: response.data }));
};
