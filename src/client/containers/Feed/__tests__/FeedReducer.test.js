import { FEED_FETCH_EVENTS_BY_LOCATION_FINISHED } from '../actionTypes';
import fetchEventsByLocationReducer from '../reducers';

const initialState = {
  0: {
    key: 'TEST',
  },
};

describe('testing feed reducer', () => {
  test('no change when no action is passed', () => {
    const ns = fetchEventsByLocationReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('fetch events by location finished action', () => {
    const action = {
      type: FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
      payload: {
        payload: {
          lat: 26.4667,
          lng: 80.35,
          zoom: 12
        },
        response: [
          {
            key: '0YAou5LPbyVMjRtHBV6X',
            lat: 26.515999258988806,
            'long': 80.23443597447508,
            category: 'health',
            title: 'Death',
            datetime: 1562598644434,
            isClustered: true
          },
          {
            key: 'cL1z6l9TQ7FpK6ypgLwF',
            lat: 26.51478401127116,
            'long': 80.22226174171146,
            category: 'nature',
            title: 'Heavy rain',
            datetime: 1562598791192
          }
        ]
      }
    };

    const ns = fetchEventsByLocationReducer(initialState, action);
    const events = {};
    action.payload.response.forEach((event) => {
      events[event.key] = event;
    });
    expect(ns).toEqual({
      ...initialState,
      [action.payload.payload.zoom]: {
        ...initialState[action.payload.payload.zoom],
        ...events,
      },
    });
  });
});
