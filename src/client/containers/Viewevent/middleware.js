/* eslint-disable no-undef */
import { EVENT_FETCH_EVENT_DATA_FINISHED, EVENT_FETCH_DIRECTIONS_FINISHED } from './actionTypes';
import { updateMapCenter, updateMapZoom, updateMapPolyline } from '../../components/Map/actions';
import { fetchReverseGeocode, fetchDirections } from './actions';


const fetchEventDataMiddleware = store => next => (action) => {
  const { dispatch } = store;
  const state = store.getState();
  if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
    const { payload } = action;
    let formattedImages = [];
    const { images } = payload;
    if (images) {
      formattedImages = Object.keys(images).map(key => images[key]);
    }
    const newAction = {
      ...action,
      payload: {
        ...action.payload,
        images: formattedImages,
      },
    };
    if (formattedImages.length) {
      // Dispatch Image URL Fetch

    }
    const lat = payload.location.coords.latitude;
    const lng = payload.location.coords.longitude;
    // Update Map Center
    dispatch(updateMapCenter({
      lat,
      lng,
      zoom: 16,
      fetch: false,
    }));
    dispatch(updateMapZoom({
      lat,
      lng,
      zoom: 16,
      fetch: false,
    }));

    if (typeof window !== 'undefined') {
      /*
      Only dispatch this action in the browser.
      When rendering the app on server, fetchReverseGeocode(lat, lng)
      action is dispatched after fetchEventData({ eventid, shouldRefresh }) finishes
      in the then callback inside loadData function of ViewEvent container.
      */

      dispatch(fetchReverseGeocode(lat, lng));

      const { locationHistory } = state.geoLocator;
      if (locationHistory.length !== 0) {
        const recentCoords = locationHistory[0];
        dispatch(fetchDirections(recentCoords.lat, recentCoords.lng, lat, lng));
      }
    }

    next(newAction);
  } else if (action.type === EVENT_FETCH_DIRECTIONS_FINISHED) {
    const { payload } = action;
    // eslint-disable-next-line camelcase
    const { polyline_points, html_instructions, distance } = payload;
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < polyline_points.length; i += 1) {
      bounds.extend(polyline_points[i]);
    }

    dispatch(updateMapPolyline({
      data: polyline_points,
      bounds,
      fitBounds: false,
      isVisible: true,
      htmlInstructions: html_instructions,
      distance,
    }));
    next(action);
  } else {
    next(action);
  }
};

export default fetchEventDataMiddleware;
