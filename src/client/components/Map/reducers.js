/* eslint-disable max-len */
import {
  MAP_UPDATE_CENTER,
  MAP_UPDATE_ZOOM,
  MAP_UPDATE_POLYLINE,
} from './actionTypes';

const initialState = {
  isVisible: false,
  // Values are hard coded. Just a subtle AOSSIE branding
  lat: -26.77,
  lng: 135.17,
  zoom: 4,
  polyline: {
    isVisible: false,
    bounds: null,
    fitBounds: false,
    data: [{ lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 151.644 }],
    distance: null,
    force: false,
  },
};

function mapUpdateReducer(state = initialState, action) {
  switch (action.type) {
    case MAP_UPDATE_CENTER:
      if (action.payload.lat && action.payload.lng) {
        return {
          ...state,
          lat: action.payload.lat,
          lng: action.payload.lng,
        };
      }
      break;
    case MAP_UPDATE_ZOOM:
      if (action.payload.zoom) {
        return {
          ...state,
          zoom: action.payload.zoom,
        };
      }
      break;
    case MAP_UPDATE_POLYLINE:
      // JEST
      if ((state.polyline !== undefined && state.polyline.force) || (action.payload !== undefined && action.payload.force)) {
        return {
          ...state,
          polyline: {
            polyline: null,
            bounds: null,
            fitBounds: false,
            isVisible: false,
            force: action.payload.force || true,
          },
        };
      }
      if (action.payload.polyline === null) {
        return {
          ...state,
          polyline: initialState.polyline,
        };
      }
      return {
        ...state,
        polyline: {
          data: action.payload.data,
          isVisible: action.payload.isVisible,
          bounds: action.payload.bounds,
          fitBounds: action.payload.fitBounds,
          distance: action.payload.distance,
          htmlInstructions: action.payload.htmlInstructions,
          force: action.payload.force || initialState.polyline.force,
        },
      };
    default:
      break;
  }
  return state;
}

export default mapUpdateReducer;
