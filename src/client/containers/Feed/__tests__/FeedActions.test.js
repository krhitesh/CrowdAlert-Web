import {
  WS_FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_USER_LOCATION,
  FEED_FETCH_USER_LOCATION_FINISHED,
  FEED_FETCH_USER_LOCATION_CANCEL,
  FEED_FETCH_EVENTS_BY_LOCATION,
  FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
} from '../actionTypes';
import {
  fetchEventsByLocation,
  fetchEventsByLocationFinished,
  fetchEventsByLocationOverWebSocket,
  fetchUserLocation,
  fetchUserLocationCancel,
  fetchUserLocationFinished,
} from '../actions';

describe('testing feed actions', () => {
  test("fetchEventsByLocation", () => {
    const payload = {
      lat: 26.4667,
      lng: 80.35,
      zoom: 12
    };
    const action = fetchEventsByLocation(payload);
    expect(action).toEqual({
      type: FEED_FETCH_EVENTS_BY_LOCATION,
      payload
    });
  });

  test("fetchEventsByLocationFinished", () => {
    const payload = {
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
    };
    const action = fetchEventsByLocationFinished(payload);
    expect(action).toEqual({
      type: FEED_FETCH_EVENTS_BY_LOCATION_FINISHED,
      payload
    });
  });

  test("fetchEventsByLocationOverWebSocket", () => {
    const payload = {
      lat: 26.4667,
      lng: 80.35,
      zoom: 12
    };
    const action = fetchEventsByLocationOverWebSocket(payload);
    expect(action).toEqual({
      type: WS_FEED_FETCH_EVENTS_BY_LOCATION,
      payload
    });
  });

  test("fetchUserLocation", () => {
    const payload = { forced: true };
    const action = fetchUserLocation(payload);
    expect(action).toEqual({
      type: FEED_FETCH_USER_LOCATION,
      payload
    });
  });

  test("fetchUserLocationCancel", () => {
    const payload = new Error('testing "fetchUserLocationCancel" action');
    const action = fetchUserLocationCancel(payload);
    expect(action).toEqual({
      type: FEED_FETCH_USER_LOCATION_CANCEL,
      payload
    });
  });

  test("fetchUserLocationFinished", () => {
    const payload = {
      forced: true,
      address: 'Kanpur, Uttar Pradesh, IN',
      city: 'Kanpur',
      country: 'IN',
      ip: 'IP',
      lat: 26.667,
      lng: 80.95,
      ok: true,
      org: 'NKN Core Network',
      postal: '8675645',
      raw: {
        ip: 'IP',
        city: 'Kanpur',
        region: 'Uttar Pradesh',
        country: 'IN',
        loc: '26.667,80.95',
        postal: '543423',
        org: 'NKN Core Network'
      },
      state: 'Uttar Pradesh',
      status: 'OK'
    };
    const action = fetchUserLocationFinished(payload);
    expect(action).toEqual({
      type: FEED_FETCH_USER_LOCATION_FINISHED,
      payload
    });
  });
});