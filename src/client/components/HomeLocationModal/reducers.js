import { MAP_ONCLICK } from '../Map/actionTypes';
import { CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT } from '../../containers/CreateEvent/actionTypes';

const initialState = {
  mapCenter: {
    lat: null,
    lng: null,
  },
  text: '',
  formatted_address: {},
  disabled: true,
};

const homeLocationReducer = (state = initialState, action) => {
  if (action.type === MAP_ONCLICK) {
    return {
      ...state,
      mapCenter: {
        lat: action.payload.lat,
        lng: action.payload.lng,
      },
      disabled: false,
    };
  } else if (action.type === CREATE_EVENTS_FORM_UPDATE_LOCATION_TEXT) {
    return {
      ...state,
      text: action.payload.text,
      formatted_address: action.payload,
    };
  }
  return initialState;
};

export default homeLocationReducer;
