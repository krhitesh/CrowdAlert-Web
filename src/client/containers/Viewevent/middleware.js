/* eslint-disable max-len */
/* eslint-disable no-undef */
import db from '../../utils/cacheAPI';
import { EVENT_FETCH_EVENT_DATA, EVENT_FETCH_EVENT_DATA_FINISHED, EVENT_FETCH_DIRECTIONS_FINISHED } from './actionTypes';
import { updateMapCenter, updateMapZoom, updateMapPolyline } from '../../components/Map/actions';
import { fetchReverseGeocode, fetchDirections, fetchEventDataFinished } from './actions';


const fetchEventDataMiddleware = store => next => (action) => {
  const { dispatch } = store;
  const state = store.getState();
  if (action.type === EVENT_FETCH_EVENT_DATA && process.env.BROWSER) {
    const { eventid, fromNetwork } = action.payload;
    // console.log('from net', fromNetwork);
    if (fromNetwork !== true) {
      db.get(eventid)
        .then((doc) => {
          console.log('Using cache', eventid);
          const newPayload = {
            cached: true,
            ...doc,
          };
          delete newPayload._id;
          delete newPayload._rev;

          // This is going to set isLoading to false and use cached incident
          dispatch(fetchEventDataFinished(newPayload));
        })
        .catch(err => console.log('Cache:', err.message));
    }
    next(action);
  } else if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
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
      } else {
        console.log('Location history is empty. Using home location');
        dispatch(fetchDirections(state.geoLocator.homeLocation.lat, state.geoLocator.homeLocation.lng, lat, lng));
      }

      if (payload.cancelSync !== true) {
        db.get(payload.eventid)
          .then(doc => db.put({
            _id: payload.eventid,
            _rev: doc._rev,
            ...payload,
          }))
          .catch(() => {
            db.put({
              _id: payload.eventid,
              ...payload,
            })
              .then((response) => {
                if (!response.ok) {
                  console.error('Failed to save the doc');
                } else {
                  console.log('Doc created', payload.eventid);
                }
              })
              .catch((createError) => {
                console.error('Cache:', createError.message);
              });
          });
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
