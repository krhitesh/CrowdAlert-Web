import {
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_FINISHED,
  EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
  EVENT_FETCH_DIRECTIONS_FINISHED,
  EVENT_FETCH_DIRECTIONS_ERROR,
} from './actionTypes';

const initialState = {
  data: {},
  imageURLS: [],
  isLoading: true,
  errors: false,
  message: null,
};

function fetchEventDataReducer(state = initialState, action) {
  if (action.type === EVENT_FETCH_EVENT_DATA && action.payload.shouldRefresh) {
    return initialState;
  }
  if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
    const { payload } = action;
    if (!payload.title) {
      return state;
    }
    return {
      ...state,
      data: payload,
      isLoading: false,
    };
  }
  if (action.type === EVENT_FETCH_REVERSE_GEOCODE_FINISHED) {
    return {
      ...state,
      reverse_geocode: action.payload,
    };
  }
  if (action.type === EVENT_FETCH_DIRECTIONS_FINISHED) {
    if (action.payload.status === 'error') {
      return {
        ...state,
        errors: true,
        message: action.payload,
        isLoading: false,
      };
    }
    return {
      ...state,
      directions: action.payload,
      isLoading: false,
    };
  }
  if (action.type === EVENT_FETCH_DIRECTIONS_ERROR) {
    return {
      ...state,
      errors: true,
      message: action.payload,
      isLoading: false,
    };
  }

  return state;
}

export default fetchEventDataReducer;
