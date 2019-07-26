import {
  GEOLOCATOR_MODAL_CLOSE,
  GEOLOCATOR_MODAL_OPEN,
  GEOLOCATOR_LOCATION_DENIED,
  GEOLOCATOR_LOCATION_FAILED,
} from '../actionTypes';
import geolocatorReducer from '../reducers';

/* UI texts */
const PERMISSION_REQUIRED_TEXT = 'We need to access your location';
const PERMISSION_DENIED_TEXT = 'You need to enable location permissions';
const LOCATION_FAILED_TEXT = 'You need enable location services. Current location is based on your network connection.';

const initialState = {
  modalText: PERMISSION_REQUIRED_TEXT,
  isOpen: false,
};

describe('testing geolocator reducer', () => {
  test('no change when no action is passed', () => {
    const ns = geolocatorReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('modal open action', () => {
    const action = {
      type: GEOLOCATOR_MODAL_OPEN,
      payload: {}
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_REQUIRED_TEXT,
      isOpen: true,
    });
  });

  test('modal close action', () => {
    const action = {
      type: GEOLOCATOR_MODAL_CLOSE,
      payload: {}
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_REQUIRED_TEXT,
      isOpen: false,
    });
  });

  test('location denied action', () => {
    const action = {
      type: GEOLOCATOR_LOCATION_DENIED,
      payload: {}
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: PERMISSION_DENIED_TEXT,
      isOpen: true,
    });
  });


  test('location failed action', () => {
    const action = {
      type: GEOLOCATOR_LOCATION_FAILED,
      payload: new Error('testing "geolocatorLocationFailed" action')
    };

    const ns = geolocatorReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modalText: LOCATION_FAILED_TEXT,
      isOpen: true,
    });
  });
});