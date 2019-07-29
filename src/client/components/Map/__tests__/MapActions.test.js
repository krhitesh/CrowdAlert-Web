import {
  MAP_UPDATE_CENTER,
  MAP_UPDATE_ZOOM,
  MAP_ONCLICK,
} from '../actionTypes';
import {
  updateMapCenter,
  updateMapZoom,
  updateOnClick,
} from '../actions';

describe('testing map actions', () => {
  it('updateMapCenter', () => {
    const payload = {
      lat: 26.46445855489077,
      lng: 80.34210357666016,
      zoom: 13,
      fetch: true,
    };

    const action = updateMapCenter(payload);
    expect(action).toEqual({
      type: MAP_UPDATE_CENTER,
      payload,
    });
  });

  it('updateMapZoom', () => {
    const payload = {
      lat: 26.46384386065638,
      lng: 80.33334884643557,
      zoom: 13,
      fetch: true,
    };

    const action = updateMapZoom(payload);
    expect(action).toEqual({
      type: MAP_UPDATE_ZOOM,
      payload,
    });
  });

  it('updateOnClick', () => {
    const payload = {
      lat: 26.46445855489077,
      lng: 80.34210357666016,
    };

    const action = updateOnClick(payload.lat, payload.lng);
    expect(action).toEqual({
      type: MAP_ONCLICK,
      payload,
    });
  });
});
