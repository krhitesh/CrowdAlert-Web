import {
  GEOLOCATOR_MODAL_CLOSE,
  GEOLOCATOR_MODAL_OPEN,
  GEOLOCATOR_LOCATION_DENIED,
  GEOLOCATOR_LOCATION_FAILED,
  GEOLOCATOR_LOCATION_SUCCESS,
} from '../actionTypes';
import geolocatorReducer from '../reducers';

/* UI texts */
const PERMISSION_REQUIRED_TEXT = 'We need to access your location';
const PERMISSION_DENIED_TEXT = 'You need to enable location permissions';
const LOCATION_FAILED_TEXT = 'You need enable location services. Current location is based on your network connection.';

const initialState = {
  modalText: PERMISSION_REQUIRED_TEXT,
  isOpen: false,
  locationHistory: [],
};

describe('testing geolocator reducer', () => {
  it('no change when no action is passed', () => {
    const ns = geolocatorReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  it('modal open action', () => {
    const action = {
      type: GEOLOCATOR_MODAL_OPEN,
      payload: {},
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_REQUIRED_TEXT,
      isOpen: true,
    });
  });

  it('modal close action', () => {
    const action = {
      type: GEOLOCATOR_MODAL_CLOSE,
      payload: {},
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_REQUIRED_TEXT,
      isOpen: false,
    });
  });

  it('location denied action', () => {
    const action = {
      type: GEOLOCATOR_LOCATION_DENIED,
      payload: {},
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_DENIED_TEXT,
      isOpen: true,
    });
  });


  it('location failed action', () => {
    const action = {
      type: GEOLOCATOR_LOCATION_FAILED,
      payload: new Error('testing "geolocatorLocationFailed" action'),
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: LOCATION_FAILED_TEXT,
      isOpen: true,
    });
  });

  it('location success action', () => {
    const action = {
      type: GEOLOCATOR_LOCATION_SUCCESS,
      payload: {
        lat: 26.2313,
        lng: 80.2323,
      },
    };

    const ns = geolocatorReducer(initialState, action);
    let newLocationHistory;
    if (initialState.locationHistory.length === 0) {
      newLocationHistory = [action.payload];
    } else if (action.payload.lat === initialState.locationHistory[0].lat &&
      action.payload.lng === initialState.locationHistory[0].lng) {
      newLocationHistory = initialState.locationHistory;
    } else {
      newLocationHistory = initialState.locationHistory;
      newLocationHistory.unshift(action.payload);
    }

    expect(ns).toEqual({
      ...initialState,
      locationHistory: newLocationHistory,
    });
  });
});
