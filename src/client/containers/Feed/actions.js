import {
  WS_FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_USER_LOCATION,
  FEED_FETCH_USER_LOCATION_FINISHED,
  FEED_FETCH_USER_LOCATION_CANCEL,
  FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
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
