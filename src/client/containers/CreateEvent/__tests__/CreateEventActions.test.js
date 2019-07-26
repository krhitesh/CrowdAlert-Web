import {
  CREATE_EVENTS_FORM_TAB_CHANGE,
  CREATE_EVENTS_FORM_TAB_CHANGE_VALIDATION,
  CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT,
  CREATE_EVENTS_FORM_SAVE_LOCATION,
  CREATE_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
  CREATE_EVENTS_FORM_VALIDATE_FORM,
  CREATE_EVENTS_FORM_VALIDATION_ERRORS,
  CREATE_EVENTS_FORM_VALIDATION_SUCCESS,
  CREATE_EVENTS_FORM_SUBMIT,
  CREATE_EVENTS_FORM_SUBMIT_SUCCESS,
  CREATE_EVENTS_FORM_SUBMIT_ERROR,
  CREATE_EVENTS_FORM_TOGGLE_UPLOADING,
} from '../actionTypes';
import {
  changeTabCreateEventsForm,
  changeTabValidationCreateEventsForm,
  createEventsUpdateLocationText,
  saveLocationCreateEvents,
  submitFormCreateEvents,
  submitFormErrorCreateEvents,
  submitFormSuccessCreateEvents,
  updateEventDetailsCreateEvents,
  toggleImageUpload,
  formValidationErrorsCreateEvents,
  acceptFormCreateEvents,
  validateFormCreateEvents
} from '../actions';

describe('testing create event actions', () => {
  test("fetchEventsByLocation", () => {
    const action = toggleImageUpload();
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_TOGGLE_UPLOADING
    });
  });

  test("submitFormErrorCreateEvents", () => {
    const error = {
      response: {
        detail: 'error detail'
      }
    };
    const action = submitFormErrorCreateEvents(error);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_SUBMIT_ERROR,
      payload: {
        message: {
          header: 'Unable to process your request',
          body: error.response.detail,
        },
      }
    });
  });

  test("changeTabCreateEventsForm", () => {
    const tabIndex = 1;
    const action = changeTabCreateEventsForm(tabIndex);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_TAB_CHANGE,
      payload: {
        tab: tabIndex
      }
    });
  });

  test("changeTabValidationCreateEventsForm", () => {
    const payload = {
      tab: 'location',
      isValid: true
    };
    const action = changeTabValidationCreateEventsForm(payload.tab, payload.isValid);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_TAB_CHANGE_VALIDATION,
      payload
    });
  });

  test("saveLocationCreateEvents", () => {
    const action = saveLocationCreateEvents();
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_SAVE_LOCATION,
    });
  });

  test("createEventsUpdateLocationText", () => {
    const payload = {
      text: 'Location information is unavailable'
    };
    const action = createEventsUpdateLocationText(payload.text);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT,
      payload
    });
  });

  test("updateEventDetailsCreateEvents", () => {
    const payload = {
      name: 'description',
      value: 'zxczxczxc'
    };
    const action = updateEventDetailsCreateEvents({
      target: {
        type: 'input',
        ...payload
      }
    });
    expect(action).toEqual({
      type: CREATE_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
      payload
    });
  });

  test("formValidationErrorsCreateEvents", () => {
    const payload = {
      validationErrors: true,
      message: {
        header: 'Event not given',
        body: 'Please select an event type from the dropdown'
      }
    };
    const action = formValidationErrorsCreateEvents(payload);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_VALIDATION_ERRORS,
      payload
    });
  });

  test("validateFormCreateEvents", () => {
    const payload = {};
    const action = validateFormCreateEvents(payload);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_VALIDATE_FORM,
      payload
    });
  });

  test("acceptFormCreateEvents", () => {
    const payload = {};
    const action = acceptFormCreateEvents(payload);
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_VALIDATION_SUCCESS,
      payload
    });
  });

  test("submitFormCreateEvents", () => {
    const payload = {
      eventData: {
        category: 'health',
        description: 'zxczxczxc',
        local_assistance: true,
        title: 'kml',
        'public': {
          view: true,
          share: true
        },
        anonymous: true,
        location: {
          coords: {
            latitude: 26.4730579270372,
            longitude: 80.33489379882815
          }
        }
      }
    };
    const action = submitFormCreateEvents({
      location: {
        mapCenter: {
          lat: payload.eventData.location.coords.latitude,
          lng: payload.eventData.location.coords.longitude,
        }
      },
      details: {
        eventType: payload.eventData.category,
        description: payload.eventData.description,
        help: payload.eventData.local_assistance,
        title: payload.eventData.title,
        public: true,
        anonymous: payload.eventData.anonymous,
      }
    });
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_SUBMIT,
      payload
    });
  });

  test("submitFormSuccessCreateEvents", () => {
    const payload = {
      eventId: 'sl6NOrYyjvTQwUtCsOha'
    };
    const action = submitFormSuccessCreateEvents({
      response: payload
    });
    expect(action).toEqual({
      type: CREATE_EVENTS_FORM_SUBMIT_SUCCESS,
      payload
    });
  });
});