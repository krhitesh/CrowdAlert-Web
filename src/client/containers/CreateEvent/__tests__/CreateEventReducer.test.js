import {
  CREATE_EVENTS_FORM_TAB_CHANGE,
  CREATE_EVENTS_FORM_TAB_CHANGE_VALIDATION,
  CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT,
  CREATE_EVENTS_FORM_SAVE_LOCATION,
  CREATE_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
  CREATE_EVENTS_FORM_VALIDATION_ERRORS,
  CREATE_EVENTS_FORM_VALIDATION_SUCCESS,
  CREATE_EVENTS_FORM_SUBMIT,
  CREATE_EVENTS_FORM_SUBMIT_SUCCESS,
  CREATE_EVENTS_FORM_SUBMIT_ERROR,
  CREATE_EVENTS_FORM_TOGGLE_UPLOADING,
} from '../actionTypes';
import { MAP_ONCLICK } from '../../../components/Map/actionTypes';
import createEventsReducer from '../reducers';

const initialState = {
  tabs: {
    activeTab: 0,
    isValid: {
      location: false,
      details: false,
      images: false,
    },
  },
  details: {
    eventType: null,
    title: '',
    description: '',
    public: true,
    help: false,
    anonymous: false,
  },
  location: {
    mapCenter: {
      lat: null,
      lng: null,
    },
    text: '',
    disabled: true,
  },
  form: {
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
  },
};

test('no change when no action is passed', () => {
  const ns = createEventsReducer(initialState, {});
  expect(ns).toEqual(initialState);
});

describe('testing switch tab reducer', () => {
  it('form tab change action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_TAB_CHANGE,
      payload: {
        tab: 1,
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      tabs: {
        ...initialState.tabs,
        activeTab: action.payload.tab,
      },
    });
  });

  it('form tab change validation action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_TAB_CHANGE_VALIDATION,
      payload: {
        tab: 'location',
        isValid: true,
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      tabs: {
        ...initialState.tabs,
        isValid: {
          ...initialState.tabs.isValid,
          [action.payload.tab]: action.payload.isValid,
        },
      },
    });
  });
});

describe('testing location tab reducer', () => {
  it('map on click action', () => {
    const action = {
      type: MAP_ONCLICK,
      payload: {
        lat: 26.46445855489077,
        lng: 80.34210357666016,
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      location: {
        ...initialState.location,
        mapCenter: {
          ...initialState.location.mapCenter,
          lat: action.payload.lat,
          lng: action.payload.lng,
        },
        disabled: false,
      },
    });
  });

  it('update location text action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT,
      payload: {
        text: 'new location text',
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      location: {
        ...initialState.location,
        text: action.payload.text,
      },
    });
  });

  it('save location action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_SAVE_LOCATION,
      payload: {},
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      location: {
        ...initialState.location,
        disabled: true,
      },
    });
  });
});

describe('testing details reducer', () => {
  it('update event details action', () => {
    const action = {
      type: CREATE_EVENTS_FORMS_UPDATE_EVENT_DETAILS,
      payload: {
        name: 'description',
        value: 'zxczxczxc',
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      details: {
        ...initialState.details,
        [action.payload.name]: action.payload.value,
      },
    });
  });
});

describe('testing report form reducer', () => {
  it('validation errors action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_VALIDATION_ERRORS,
      payload: {
        validationErrors: true,
        message: {
          header: 'Event not given',
          body: 'Please select an event type from the dropdown',
        },
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        validationErrors: true,
        message: {
          header: action.payload.message.header,
          body: action.payload.message.body,
        },
        loading: false,
        isFreezed: false,
      },
    });
  });

  it('validation success action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_VALIDATION_SUCCESS,
      payload: {},
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        isFreezed: true,
        loading: false,
        validationErrors: false,
      },
    });
  });

  it('form submit action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_SUBMIT,
      payload: {},
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        isFreezed: true,
        loading: true,
        validationErrors: false,
      },
    });
  });


  it('form submit success action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_SUBMIT_SUCCESS,
      payload: {
        eventId: 'eventId',
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        isFreezed: true,
        loading: false,
        validationErrors: false,
        eventID: action.payload.eventId,
      },
    });
  });

  it('form submit error action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_SUBMIT_ERROR,
      payload: {
        message: {
          header: 'Unable to process your request',
          body: 'error body',
        },
      },
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        validationErrors: true,
        message: {
          header: action.payload.message.header,
          body: action.payload.message.body,
        },
        loading: false,
        isFreezed: false,
      },
    });
  });


  it('toggle uploading action', () => {
    const action = {
      type: CREATE_EVENTS_FORM_TOGGLE_UPLOADING,
      payload: {},
    };

    const ns = createEventsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      form: {
        ...initialState.form,
        uploading: !initialState.form.uploading,
      },
    });
  });
});
