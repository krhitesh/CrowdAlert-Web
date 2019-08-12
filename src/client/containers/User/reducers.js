import { combineReducers } from 'redux';
import {
  USER_DELETE_USER,
  USER_DELETE_USER_ERROR,
  USER_DELETE_USER_SUCCESS,
  USER_UPDATE_USER_CREDENTIALS,
  USER_UPDATE_USER_CREDENTIALS_ERROR,
  USER_UPDATE_USER_CREDENTIALS_SUCCESS,
  USER_GET_INFO,
  USER_GET_INFO_FAILED,
  USER_GET_INFO_SUCCESS,
  USER_IMAGE_UPLOAD_ERROR,
  USER_GET_INCIDENTS,
  USER_GET_INCIDENTS_ERROR,
  USER_GET_INCIDENTS_SUCCESS,
} from './actionTypes';
import {
  HOME_LOCATION_SAVE_LOCATION_ERROR,
  HOME_LOCATION_SAVE_LOCATION_SUCCESS,
  HOME_LOCATION_SAVE_LOCATION,
} from '../../components/HomeLocationModal/actionTypes';

const settingsInitialState = {
  isLoading: false,
  errors: false,
  message: null,
};

function settingsReducer(state = settingsInitialState, action) {
  switch (action.type) {
    case USER_DELETE_USER:
      return {
        ...state,
        isLoading: true,
        errors: false,
      };
    case USER_DELETE_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: action.payload,
      };
    case USER_DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: false,
      };
    case USER_UPDATE_USER_CREDENTIALS:
      return {
        ...state,
        isLoading: true,
        errors: false,
      };
    case USER_UPDATE_USER_CREDENTIALS_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: action.payload,
      };
    case USER_UPDATE_USER_CREDENTIALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: false,
      };
    case HOME_LOCATION_SAVE_LOCATION_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: action.payload,
      };
    case HOME_LOCATION_SAVE_LOCATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: false,
      };
    case HOME_LOCATION_SAVE_LOCATION:
      return {
        ...state,
        isLoading: true,
        errors: false,
      };
    case USER_GET_INFO:
      return {
        ...state,
        isLoading: true,
        errors: false,
      };
    case USER_GET_INFO_FAILED:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: 'Failed to fetch home location',
      };
    case USER_GET_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: false,
      };
    default:
      return state;
  }
}

const profileInitialState = {
  isLoading: false,
  errors: false,
  message: null,
};

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case USER_UPDATE_USER_CREDENTIALS:
      return {
        ...state,
        isLoading: true,
        errors: false,
      };
    case USER_UPDATE_USER_CREDENTIALS_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: action.payload,
      };
    case USER_UPDATE_USER_CREDENTIALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errors: false,
      };
    case USER_IMAGE_UPLOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        errors: true,
        message: action.payload,
      };
    default:
      return state;
  }
};

const incidentsListInitialState = {
  isLoading: false,
  errors: false,
  message: null,
  incidents: [],
};

const incidentsListReducer = (state = incidentsListInitialState, action) => {
  switch (action.type) {
    case USER_GET_INCIDENTS:
      return {
        ...state,
        isLoading: true,
      };
    case USER_GET_INCIDENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        incidents: action.payload,
      };
    case USER_GET_INCIDENTS_ERROR:
      return {
        ...state,
        errors: true,
        message: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default combineReducers({
  settings: settingsReducer,
  profile: profileReducer,
  incidents: incidentsListReducer,
});
