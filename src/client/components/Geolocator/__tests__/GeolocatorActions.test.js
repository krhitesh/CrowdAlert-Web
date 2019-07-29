import {
  GEOLOCATOR_LOCATION_FETCH,
  GEOLOCATOR_LOCATION_GET_PERMISSION,
  GEOLOCATOR_LOCATION_SUCCESS,
  GEOLOCATOR_LOCATION_DENIED,
  GEOLOCATOR_LOCATION_FAILED,
  GEOLOCATOR_MODAL_OPEN,
  GEOLOCATOR_MODAL_CLOSE,
} from '../actionTypes';
import {
  geolocatorFetchLocation,
  geolocatorLocationDenied,
  geolocatorLocationFailed,
  geolocatorLocationSuccess,
  geolocatorModalClose,
  geolocatorModalOpen,
  geolocatoretLocationPermission,
} from '../actions';

describe('testing geolocator actions', () => {
  it('geolocatoretLocationPermission', () => {
    const payload = {
      modal: {
        modalText: 'We need to access your location',
        isOpen: false,
      },
      static: false,
      size: 'huge',
      circular: true,
      fetchOnLoad: false,
      floated: 'right',
    };

    const action = geolocatoretLocationPermission(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_LOCATION_GET_PERMISSION,
      payload,
    });
  });

  it('geolocatorLocationDenied', () => {
    const payload = {};

    const action = geolocatorLocationDenied(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_LOCATION_DENIED,
      payload,
    });
  });

  it('geolocatorModalClose', () => {
    const payload = {};

    const action = geolocatorModalClose(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_MODAL_CLOSE,
      payload,
    });
  });

  it('geolocatorModalOpen', () => {
    const payload = {};

    const action = geolocatorModalOpen(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_MODAL_OPEN,
      payload,
    });
  });

  it('geolocatorFetchLocation', () => {
    const payload = {};

    const action = geolocatorFetchLocation(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_LOCATION_FETCH,
      payload,
    });
  });

  it('geolocatorLocationSuccess', () => {
    const payload = {
      lat: 26.5083242,
      lng: 80.2263353,
    };

    const action = geolocatorLocationSuccess(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_LOCATION_SUCCESS,
      payload,
    });
  });

  it('geolocatorLocationFailed', () => {
    const payload = new Error('testing "geolocatorLocationFailed" action');

    const action = geolocatorLocationFailed(payload);
    expect(action).toEqual({
      type: GEOLOCATOR_LOCATION_FAILED,
      payload,
    });
  });
});
