import { updatedDiff } from 'deep-object-diff';
import {
  EDIT_EVENTS_FORM_TAB_CHANGE,
  EDIT_EVENTS_FORM_TAB_CHANGE_VALIDATION,
  EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT,
  EDIT_EVENTS_FORM_SAVE_LOCATION,
  EDIT_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
  EDIT_EVENTS_FORM_VALIDATE_FORM,
  EDIT_EVENTS_FORM_VALIDATION_ERRORS,
  EDIT_EVENTS_FORM_VALIDATION_SUCCESS,
  EDIT_EVENTS_FORM_SUBMIT,
  EDIT_EVENTS_FORM_SUBMIT_SUCCESS,
  EDIT_EVENTS_FORM_SUBMIT_ERROR,
  EDIT_EVENTS_FORM_TOGGLE_UPLOADING,
  EDIT_EVENTS_OLD_EVENT,
} from './actionTypes';

/**
 * Changes tab based on the tab ID
 * @param {*} tabIndex Target Tab index
 */
export function changeTabEditEventsForm(tabIndex) {
  return {
    type: EDIT_EVENTS_FORM_TAB_CHANGE,
    payload: {
      tab: tabIndex,
    },
  };
}
/**
 * Marks tab as validated
 * @param {*} tab : Tab id
 * @param {*} isValid : Whether target tab is valid or not
 */
export function changeTabValidationEditEventsForm(tab, isValid) {
  return {
    type: EDIT_EVENTS_FORM_TAB_CHANGE_VALIDATION,
    payload: {
      tab,
      isValid,
    },
  };
}
/**
 * Updates the reverse geocode of the user pointed location
 * @param {*} text : Reverse Geocode
 */
export function editEventsUpdateLocationText(text) {
  return {
    type: EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT,
    payload: {
      text,
    },
  };
}
/**
 * Mark the location as saved
 */
export function saveLocationEditEvents() {
  return {
    type: EDIT_EVENTS_FORM_SAVE_LOCATION,
  };
}
/**
 * Updates the event details of the incident. Should use a react component based
 * update mechanism & update the redux store when saved
 * @param {*} event : DOM event
 */
export function updateEventDetailsEditEvents(event) {
  const { target } = event;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const { name } = target;
  return {
    type: EDIT_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
    payload: {
      name,
      value,
    },
  };
}
/**
 * Whether there are any errors in the form
 * @param {*} payload : Object
 */
export function formValidationErrorsEditEvents(payload = {}) {
  return {
    type: EDIT_EVENTS_FORM_VALIDATION_ERRORS,
    payload,
  };
}
/**
 * Validate the input form as validated
 * @param {*} payload
 */
export function validateFormEditEvents(payload = {}) {
  return {
    type: EDIT_EVENTS_FORM_VALIDATE_FORM,
    payload,
  };
}
/**
 * Mark the incident form as validated
 */
export function acceptFormEditEvents(payload = {}) {
  return {
    type: EDIT_EVENTS_FORM_VALIDATION_SUCCESS,
    payload,
  };
}
export function keepOldEvent(payload = {}) {
  return {
    type: EDIT_EVENTS_OLD_EVENT,
    payload,
  };
}
/**
 * Submits the form
 * @param {*} ObjectOf({ location, details })
 * location: {mapCenter: {
 *    lat: float,
 *    lng: float,
 * }}
 */
export function submitFormEditEvents({ location, details, form }) {
  const eventData = {
    category: details.eventType,
    description: details.description,
    local_assistance: details.help,
    title: details.title,
    public: {
      view: details.public,
      share: details.help,
    },
    anonymous: details.anonymous,
    location: {
      coords: {
        latitude: location.mapCenter.lat,
        longitude: location.mapCenter.lng,
      },
    },
  };

  const { old } = form;
  const diff = updatedDiff(old, eventData);
  diff.eventid = old.eventid;
  return {
    type: EDIT_EVENTS_FORM_SUBMIT,
    payload: {
      eventData: diff,
      all: {
        ...old,
        ...eventData,
      },
    },
  };
}
/**
 * Event submission success
 * @param {*} Object { response }
 */
export function submitFormSuccessEditEvents({ response }) {
  return {
    type: EDIT_EVENTS_FORM_SUBMIT_SUCCESS,
    payload: response,
  };
}
/**
 * Event submission error
 * @param {*} error
 */
export function submitFormErrorEditEvents(error = {}) {
  return {
    type: EDIT_EVENTS_FORM_SUBMIT_ERROR,
    payload: {
      message: {
        header: 'Unable to process your request',
        body: error.response.detail,
      },
    },
  };
}
// Deprecated
export function toggleImageUpload() {
  return {
    type: EDIT_EVENTS_FORM_TOGGLE_UPLOADING,
  };
}
