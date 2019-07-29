import {
  EVENT_PREVIEW_OPEN,
  EVENT_PREVIEW_CLOSE,
} from '../actionTypes';
import {
  openEventPreview,
  closeEventPreview,
} from '../actions';

describe('testing event preview card actions', () => {
  it('openEventPreview', () => {
    const payload = {
      key: 'cL1z6l9TQ7FpK6ypgLwF',
      lat: 26.51478401127116,
      long: 80.22226174171146,
      category: 'nature',
      title: 'Heavy rain',
      datetime: 1562598791192,
    };
    const action = openEventPreview(payload);
    expect(action).toEqual({
      type: EVENT_PREVIEW_OPEN,
      payload,
    });
  });

  it('closeEventPreview', () => {
    const payload = {};
    const action = closeEventPreview(payload);
    expect(action).toEqual({
      type: EVENT_PREVIEW_CLOSE,
      payload,
    });
  });
});
