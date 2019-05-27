import { takeEvery } from 'redux-saga/effects';
import { WS_FEED_FETCH_EVENTS_BY_LOCATION } from '../containers/Feed/actionTypes';

const sendData = (params, lat, lng, zoom, distance, MPP) => {
  // eslint-disable-next-line no-undef
  if (params.socket.readyState === WebSocket.OPEN) {
    const data = JSON.stringify({
      lat,
      lng,
      zoom,
      dist: distance,
      min: MPP,
    });
    params.socket.send(data);
  } else if (params.socket.readyState === WebSocket.CONNECTING) {
    console.log('WebSocket not ready yet');
  } else if (params.socket.readyState === WebSocket.CLOSED) {
    console.log('WebSocket is disconnected.');
  }
};

const handleNewMessage = function* handleNewMessage(params) {
  yield takeEvery(WS_FEED_FETCH_EVENTS_BY_LOCATION, (action) => {
    let maxPixels = 1920;
    try {
      maxPixels = Math.max(window.innerHeight, window.innerWidth);
    } catch (error) {
      maxPixels = 1920;
    }

    let { lat, lng, zoom } = action.payload;
    if (!lat || !lng || !zoom) {
      // Use default australia's values and proceed
      console.log('Invalid values', lat, lng, zoom);
      lat = -26.77;
      lng = 135.17;
      zoom = 4;
    }
    // https://gis.stackexchange.com/a/127949
    // metres per pixel
    const MPP = ((156543.03392 * Math.cos((lat * Math.PI) / 180)) / (2 ** zoom)) * 0.04;
    const distance = Math.ceil(((MPP) * maxPixels) / 1000) + 1;

    sendData(params, lat, lng, zoom, distance, MPP);
  });
};

export default handleNewMessage;
