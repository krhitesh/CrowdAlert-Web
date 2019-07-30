import {
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_CANCEL,
  EVENT_FETCH_EVENT_DATA_FINISHED,
  EVENT_FETCH_REVERSE_GEOCODE,
  EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
  EVENT_FETCH_DIRECTIONS,
  EVENT_FETCH_DIRECTIONS_FINISHED,
} from './actionTypes';

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
  console.log(payload);
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
