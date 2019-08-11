import { combineReducers } from 'redux';
import {
  EDIT_EVENTS_FORM_TAB_CHANGE,
  EDIT_EVENTS_FORM_TAB_CHANGE_VALIDATION,
  EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT,
  EDIT_EVENTS_FORM_SAVE_LOCATION,
  EDIT_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
  EDIT_EVENTS_FORM_VALIDATION_ERRORS,
  EDIT_EVENTS_FORM_VALIDATION_SUCCESS,
  EDIT_EVENTS_FORM_SUBMIT,
  EDIT_EVENTS_FORM_SUBMIT_SUCCESS,
  EDIT_EVENTS_FORM_SUBMIT_ERROR,
  EDIT_EVENTS_FORM_TOGGLE_UPLOADING,
  EDIT_EVENTS_OLD_EVENT,
  EDIT_EVENTS_FORM_VALIDATE_LOCATION_ERROR,
} from './actionTypes';
import { MAP_ONCLICK } from '../../components/Map/actionTypes';
import { EVENT_FETCH_EVENT_DATA_FINISHED } from '../Viewevent/actionTypes';


const tabInitialState = {
  activeTab: 0,
  isValid: {
    location: false,
    details: false,
    images: false,
  },
};
function switchTabReducer(state = tabInitialState, action) {
  if (action.type === EDIT_EVENTS_FORM_TAB_CHANGE) {
    return {
      ...state,
      activeTab: action.payload.tab,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_TAB_CHANGE_VALIDATION) {
    return {
      ...state,
      isValid: {
        ...state.isValid,
        [action.payload.tab]: action.payload.isValid,
      },
    };
  }
  return state;
}
const locationInitialState = {
  mapCenter: {
    lat: null,
    lng: null,
  },
  text: '',
  disabled: true,
  validationErrors: false,
};
function locaitonTabReducer(state = locationInitialState, action) {
  if (action.type === EDIT_EVENTS_FORM_VALIDATE_LOCATION_ERROR) {
    return {
      ...state,
      validationErrors: true,
    };
  }
  if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
    const { payload } = action;
    return {
      ...state,
      mapCenter: {
        lat: payload.location.coords.latitude,
        lng: payload.location.coords.longitude,
      },
      disabled: false,
    };
  }
  if (action.type === MAP_ONCLICK) {
    return {
      ...state,
      mapCenter: {
        lat: action.payload.lat,
        lng: action.payload.lng,
      },
      disabled: false,
      validationErrors: false,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT) {
    return {
      ...state,
      text: action.payload.text,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_SAVE_LOCATION) {
    return {
      ...state,
      disabled: true,
      validationErrors: false,
    };
  }
  return state;
}
const detailsInitialState = {
  eventType: null,
  title: '',
  description: '',
  public: true,
  help: false,
  anonymous: false,
};
function detailsReducer(state = detailsInitialState, action) {
  if (action.type === EDIT_EVENTS_FORMS_UPDATE_EVENT_DETAILS) {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }
  return state;
}
const reportFormInitialState = {
  loading: false,
  message: {
    header: '',
    body: '',
  },
  eventID: null,
  isFreezed: false,
  validationErrors: false,
  uploading: false,
  imageSelectDisabled: false,
  old: null,
};
function reportFormReducer(state = reportFormInitialState, action) {
  if (action.type === EDIT_EVENTS_OLD_EVENT) {
    return {
      ...state,
      old: action.payload,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_VALIDATION_ERRORS) {
    return {
      ...state,
      validationErrors: true,
      message: {
        header: action.payload.message.header,
        body: action.payload.message.body,
      },
      loading: false,
      isFreezed: false,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_VALIDATION_SUCCESS) {
    return {
      ...state,
      isFreezed: true,
      loading: false,
      validationErrors: false,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_SUBMIT) {
    return {
      ...state,
      isFreezed: true,
      loading: true,
      validationErrors: false,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_SUBMIT_SUCCESS) {
    return {
      ...state,
      isFreezed: true,
      loading: false,
      validationErrors: false,
      eventID: action.payload.eventId,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_SUBMIT_ERROR) {
    return {
      ...state,
      validationErrors: true,
      message: {
        header: action.payload.message.header,
        body: action.payload.message.body,
      },
      loading: false,
      isFreezed: false,
    };
  }
  if (action.type === EDIT_EVENTS_FORM_TOGGLE_UPLOADING) {
    return {
      ...state,
      uploading: !state.uploading,
    };
  }
  return state;
}
const editEventsReducer = combineReducers({
  tabs: switchTabReducer,
  details: detailsReducer,
  location: locaitonTabReducer,
  form: reportFormReducer,
});

export default editEventsReducer;
