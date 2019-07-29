import {
  MAP_UPDATE_CENTER,
  MAP_UPDATE_ZOOM,
} from '../actionTypes';
import mapReducer from '../reducers';

const initialState = {
  isVisible: false,
  // Values are hard coded. Just a subtle AOSSIE branding
  lat: -26.77,
  lng: 135.17,
  zoom: 4,
};

describe('testing map reducer', () => {
  it('no change when no action is passed', () => {
    const ns = mapReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  it('map update center action', () => {
    const action = {
      type: MAP_UPDATE_CENTER,
      payload: {
        lat: 26.46445855489077,
        lng: 80.34210357666016,
        zoom: 13,
        fetch: true,
      },
    };

    const ns = mapReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      lat: action.payload.lat,
      lng: action.payload.lng,
    });
  });

  it('update zoom action', () => {
    const action = {
      type: MAP_UPDATE_ZOOM,
      payload: {
        lat: 26.46384386065638,
        lng: 80.33334884643557,
        zoom: 13,
        fetch: true,
      },
    };

    const ns = mapReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      zoom: action.payload.zoom,
    });
  });
});
