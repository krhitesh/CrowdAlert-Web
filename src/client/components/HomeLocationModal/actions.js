import {
  HOME_LOCATION_SAVE_LOCATION,
  HOME_LOCATION_SAVE_LOCATION_SUCCESS,
  HOME_LOCATION_SAVE_LOCATION_ERROR,
} from './actionTypes';

export function saveHomeLocation(lat, lng, text) {
  return {
    type: HOME_LOCATION_SAVE_LOCATION,
    payload: {
      lat,
      lng,
      text,
    },
  };
}
export function saveHomeLocationSuccess(payload) {
  return {
    type: HOME_LOCATION_SAVE_LOCATION_SUCCESS,
    payload,
  };
}
export function saveHomeLocationError(payload) {
  return {
    type: HOME_LOCATION_SAVE_LOCATION_ERROR,
    payload,
  };
}
