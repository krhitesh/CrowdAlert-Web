import { WS_GET_EVENTS_BY_LOCATION } from '../utils/apipaths';
import { FEED_FETCH_EVENTS_BY_LOCATION_FINISHED, WS_NEW_EVENT_RECEIVED } from '../containers/Feed/actionTypes';
import { fetchEventsByLocationFinished } from '../containers/Feed/actions';
import { WS_COMMENTS_FETCH_THREAD } from '../components/Comments/actionTypes';
import distanceCoordinates from '../utils/gps';

export default (store) => {
  const { dispatch } = store;
  // eslint-disable-next-line no-undef
  const socket = new WebSocket(WS_GET_EVENTS_BY_LOCATION);

  socket.onopen = () => {
    console.log('socket.open');
  };

  socket.onclose = () => {
    console.log('socket.onclose');
  };

  socket.onerror = (err) => {
    console.log('socket.onerror', err);
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('socket.onmessage', message);
    if (message.actionType === FEED_FETCH_EVENTS_BY_LOCATION_FINISHED) {
      dispatch(fetchEventsByLocationFinished({
        payload: message.actionPayload,
        response: message.data,
      }));
    } else if (message.actionType === WS_NEW_EVENT_RECEIVED) {
      const { lat, lng, zoom } = store.getState().map;
      const lat1 = message.data.lat;
      const lng1 = message.data.lng;

      let maxPixels = 1920;
      try {
        maxPixels = Math.max(window.innerHeight, window.innerWidth);
      } catch (error) {
        maxPixels = 1920;
      }
      const MPP = ((156543.03392 * Math.cos((lat * Math.PI) / 180)) / (2 ** zoom));
      const distance = Math.ceil(((MPP) * maxPixels) / 1000) + 1;

      if (distanceCoordinates(lat, lng, lat1, lng1) <= distance) {
        dispatch(fetchEventsByLocationFinished({
          payload: {
            zoom,
          },
          response: [message.data],
        }));
      }
    } else if (message.actionType === WS_COMMENTS_FETCH_THREAD) {
      console.log(message);
    }
  };

  return socket;
};
