import {
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_FINISHED,
  EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
} from '../actionTypes';
import fetchEventDataReducer from '../reducer';

const initialState = {
  data: {},
  imageURLS: [],
  isLoading: true,
  errors: false,
  message: null,
};

describe('testing view event reducer', () => {
  it('no change when no action is passed', () => {
    const ns = fetchEventDataReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  it('fetch event data action', () => {
    const action = {
      type: EVENT_FETCH_EVENT_DATA,
      payload: {
        eventid: 'eventid',
        shouldRefresh: true,
      },
    };

    const ns = fetchEventDataReducer(initialState, action);
    expect(ns).toEqual(initialState);
  });

  it('fetch event data finished action with title', () => {
    const action = {
      type: EVENT_FETCH_EVENT_DATA_FINISHED,
      payload: {
        eventid: 'ylFaLmmIsW6AUd1EHS1r',
        shouldRefresh: false,
        category: 'electric',
        datetime: 1562598383931,
        description: 'Testing first firestore incident.',
        local_assistance: false,
        location: {
          coords: {
            latitude: 26.517945989465012,
            longitude: 80.23529190635986,
          },
          geohash: 'tu9ncg3w1z3v',
        },
        public: {
          view: true,
          share: false,
        },
        reportedBy: {
          original: {
            displayName: 'Hitesh Kumar',
            photoURL:
              'https://lh4.googleusercontent.com/-peeRetkut0g/AAAAAAAAAAI/AAAAAAAAEIM/Ss8Rhw2EMjY/photo.jpg',
          },
        },
        title: 'Firestore test 1',
        images: [
          {
            isNsfw: false,
            uuid: '26ee6e51-945a-4f65-a250-e6bddc2e4584.jpg',
            isTrusted: false,
          },
        ],
        spam: {
          uuid: 'ylFaLmmIsW6AUd1EHS1r',
          count: 0,
          toxic: {},
        },
      },
    };

    const ns = fetchEventDataReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      data: action.payload,
      isLoading: false,
    });
  });

  it('fetch event data finished action', () => {
    const action = {
      type: EVENT_FETCH_EVENT_DATA_FINISHED,
      payload: {
        eventid: 'ylFaLmmIsW6AUd1EHS1r',
        shouldRefresh: false,
      },
    };

    const ns = fetchEventDataReducer(initialState, action);
    expect(ns).toEqual(initialState);
  });

  it('fetch reverse geocode success action', () => {
    const action = {
      type: EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
      payload: {
        lat: '26.49602',
        lon: '80.31414',
        name: 'Nawabganj',
        admin1: 'Uttar Pradesh',
        admin2: 'Kanpur',
        cc: 'IN',
      },
    };

    const ns = fetchEventDataReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      reverse_geocode: action.payload,
    });
  });
});
