/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { USER_PROFILES } from '../../utils/apipaths';
import {
  USER_UPDATE_USER_DATA,
  USER_UPDATE_USER_DATA_ERROR,
  USER_UPDATE_USER_DATA_SUCCESS,
  USER_DELETE_USER,
  USER_DELETE_USER_ERROR,
  USER_DELETE_USER_SUCCESS,
  USER_UPDATE_USER_CREDENTIALS,
  USER_UPDATE_USER_CREDENTIALS_ERROR,
  USER_UPDATE_USER_CREDENTIALS_SUCCESS,
  USER_GET_INFO,
  USER_GET_INFO_FAILED,
  USER_GET_INFO_SUCCESS,
  USER_GET_INFO_SSR,
  USER_IMAGE_UPLOAD_ERROR,
  USER_GET_INCIDENTS,
  USER_GET_INCIDENTS_ERROR,
  USER_GET_INCIDENTS_SUCCESS,
} from './actionTypes';

export function userGetIncidentsSuccess(payload = {}) {
  return {
    type: USER_GET_INCIDENTS_SUCCESS,
    payload,
  };
}
export function userGetIncidentsError(payload = {}) {
  return {
    type: USER_GET_INCIDENTS_ERROR,
    payload,
  };
}
export function userGetIncidents(payload = {}) {
  return {
    type: USER_GET_INCIDENTS,
    payload,
  };
}
export function userImageUploadError(payload = {}) {
  return {
    type: USER_IMAGE_UPLOAD_ERROR,
    payload,
  };
}
export function updateUserCredentials(email = null, password = null, displayName = null, photoURL = null) {
  return {
    type: USER_UPDATE_USER_CREDENTIALS,
    payload: {
      email,
      password,
      displayName,
      photoURL,
    },
  };
}
export function userGetInfo(payload = {}) {
  return {
    type: USER_GET_INFO,
    payload,
  };
}
export function userGetInfoSuccess(payload = {}) {
  return {
    type: USER_GET_INFO_SUCCESS,
    payload,
  };
}
export const userGetInfoSSR = (payload = {}, token) => async (dispatch, getState) => {
  const { data } = await axios({
    method: 'get',
    url: `${USER_PROFILES}?key=${payload.key}`,
    headers: {
      token,
    },
  });

  dispatch({
    type: USER_GET_INFO_SSR,
    payload,
  });

  dispatch(userGetInfoSuccess(data));
};
export function userGetInfoFailed(payload = {}) {
  return {
    type: USER_GET_INFO_FAILED,
    payload,
  };
}
export function updateUserCredentialsSuccess(payload = {}) {
  return {
    type: USER_UPDATE_USER_CREDENTIALS_SUCCESS,
    payload,
  };
}
export function updateUserCredentialsFailed(payload = {}) {
  return {
    type: USER_UPDATE_USER_CREDENTIALS_ERROR,
    payload,
  };
}
export function deleteUserSuccess(payload) {
  return {
    type: USER_DELETE_USER_SUCCESS,
    payload,
  };
}
export function deleteUserFailed(payload) {
  return {
    type: USER_DELETE_USER_ERROR,
    payload,
  };
}
export function deleteUser(payload) {
  return {
    type: USER_DELETE_USER,
    payload,
  };
}
export function updateUserData(payload) {
  return {
    type: USER_UPDATE_USER_DATA,
    payload,
  };
}
export function updateUserDataError(payload) {
  return {
    type: USER_UPDATE_USER_DATA_ERROR,
    payload,
  };
}
export function updateUserDataSuccess(payload) {
  return {
    type: USER_UPDATE_USER_DATA_SUCCESS,
    payload,
  };
}
