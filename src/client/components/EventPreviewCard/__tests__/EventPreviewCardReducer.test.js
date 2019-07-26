import {
  EVENT_PREVIEW_OPEN,
  EVENT_PREVIEW_CLOSE,
} from '../actionTypes';
import eventPreviewCardReducer from '../reducers';

const initialState = {
  // If the incident preview is open or not
  isOpen: false,
  event: null,
};

describe('testing event preview card reducer', () => {
  test('no change when no action is passed', () => {
    const ns = eventPreviewCardReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('open action', () => {
    const action = {
      type: EVENT_PREVIEW_OPEN,
      payload: {
        key: 'cL1z6l9TQ7FpK6ypgLwF',
        lat: 26.51478401127116,
        'long': 80.22226174171146,
        category: 'nature',
        title: 'Heavy rain',
        datetime: 1562598791192
      }
    };

    const ns = eventPreviewCardReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      isOpen: true,
      event: action.payload
    });
  });

  test('close action', () => {
    const action = {
      type: EVENT_PREVIEW_CLOSE,
      payload: {}
    };

    const ns = eventPreviewCardReducer(initialState, action);
    expect(ns).toEqual(initialState);
  });

});
