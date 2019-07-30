import {
  MAP_UPDATE_CENTER,
  MAP_UPDATE_ZOOM,
  MAP_ONCLICK,
  MAP_UPDATE_POLYLINE,
} from '../actionTypes';
import {
  updateMapCenter,
  updateMapZoom,
  updateOnClick,
  updateMapPolyline
} from '../actions';

describe('testing map actions', () => {
  test('updateMapCenter', () => {
    const payload = {
      lat: 26.46445855489077,
      lng: 80.34210357666016,
      zoom: 13,
      fetch: true
    };

    const action = updateMapCenter(payload);
    expect(action).toEqual({
      type: MAP_UPDATE_CENTER,
      payload
    });
  });

  test('updateMapZoom', () => {
    const payload = {
      lat: 26.46384386065638,
      lng: 80.33334884643557,
      zoom: 13,
      fetch: true
    };

    const action = updateMapZoom(payload);
    expect(action).toEqual({
      type: MAP_UPDATE_ZOOM,
      payload
    });
  });

  test('updateOnClick', () => {
    const payload = {
      lat: 26.46445855489077,
      lng: 80.34210357666016,
    };

    const action = updateOnClick(payload.lat, payload.lng);
    expect(action).toEqual({
      type: MAP_ONCLICK,
      payload
    });
  });

  it('updateMapPolyline', () => {
    const payload = {
      isVisible: false,
      bounds: null,
      fitBounds: false,
      data: [{ lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 151.644 }],
      distance: null,
    };

    const action = updateMapPolyline(payload);
    expect(action).toEqual({
      type: MAP_UPDATE_POLYLINE,
      payload,
    });
  });
});
