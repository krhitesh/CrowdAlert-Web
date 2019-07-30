import {
  EVENT_FETCH_EVENT_DATA,
  EVENT_FETCH_EVENT_DATA_CANCEL,
  EVENT_FETCH_EVENT_DATA_FINISHED,
  EVENT_FETCH_REVERSE_GEOCODE,
  EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
  EVENT_FETCH_DIRECTIONS,
  EVENT_FETCH_DIRECTIONS_FINISHED,
} from '../actionTypes';
import {
  fetchEventData,
  fetchEventDataCanceled,
  fetchEventDataFinished,
  fetchReverseGeocode,
  fetchReverseGeocodeSuccess,
  fetchDirections,
  fetchDirectionsSuccess,
} from '../actions';

describe('testing viewevent actions', () => {
  it('fetchEventData', () => {
    const payload = { eventid: 'eventid', shouldRefresh: false };
    const action = fetchEventData({ eventid: 'eventid', shouldRefresh: false });
    expect(action).toEqual({
      type: EVENT_FETCH_EVENT_DATA,
      payload,
    });
  });

  it('fetchEventDataCanceled', () => {
    const payload = {};
    const action = fetchEventDataCanceled({});
    expect(action).toEqual({
      type: EVENT_FETCH_EVENT_DATA_CANCEL,
      payload,
    });
  });

  it('fetchEventDataFinished', () => {
    const payload = {
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
    };
    const action = fetchEventDataFinished(payload);
    expect(action).toEqual({
      type: EVENT_FETCH_EVENT_DATA_FINISHED,
      payload,
    });
  });

  it('fetchReverseGeocode', () => {
    const payload = {
      lat: 26.517945989465012,
      lng: 80.23529190635986,
    };
    const action = fetchReverseGeocode(payload.lat, payload.lng);
    expect(action).toEqual({
      type: EVENT_FETCH_REVERSE_GEOCODE,
      payload,
    });
  });

  it('fetchReverseGeocodeSuccess', () => {
    const payload = {
      lat: '26.49602',
      lon: '80.31414',
      name: 'Nawabganj',
      admin1: 'Uttar Pradesh',
      admin2: 'Kanpur',
      cc: 'IN',
    };
    const action = fetchReverseGeocodeSuccess(payload);
    expect(action).toEqual({
      type: EVENT_FETCH_REVERSE_GEOCODE_FINISHED,
      payload,
    });
  });

  it('fetchDirectionsSuccess', () => {
    const payload = { };
    const action = fetchDirectionsSuccess(payload);
    expect(action).toEqual({
      type: EVENT_FETCH_DIRECTIONS_FINISHED,
      payload,
    });
  });

  it('fetchDirections', () => {
    const payload = {
      startLat: 26.1111,
      startLon: 80.1111,
      endLat: 26.0000,
      endLon: 80.0000,
    };
    const action = fetchDirections(26.1111, 80.1111, 26.0000, 80.0000);
    expect(action).toEqual({
      type: EVENT_FETCH_DIRECTIONS,
      payload,
    });
  });
});
