import {
  MAP_UPDATE_CENTER,
  MAP_UPDATE_ZOOM,
  MAP_ONCLICK,
  MAP_UPDATE_POLYLINE,
} from './actionTypes';

/**
 * Updated the map center based on the scrolling activity
 * @param {*} payload : Object of { fetch, lat, lng }
 */
// TODO: Use object destructuring to validate data
export function updateMapCenter(payload = {}) {
  return {
    type: MAP_UPDATE_CENTER,
    payload,
  };
}
/**
 * Updates the map zoom based on the scroll activity
 * @param {*} payload : Object of { zoom }
 */
export function updateMapZoom(payload = {}) {
  return {
    type: MAP_UPDATE_ZOOM,
    payload,
  };
}
/**
 * Updates the polyline on map
 * @param {*} payload : Object of {
 *  data: Array of Object { lat: number, lng: number }
 *  isVisible: Is the polyline visible
 *  bounds: Polyline google.maps.LatLngBounds
 *  fitBounds: Does the polyline fits into the map's viewport
 *  distance?: Distance of so represented polyline
 *  htmlInstructions?: Directional instructions of the route represented by the polyline
 *  }
 */
export function updateMapPolyline(payload = {}) {
  return {
    type: MAP_UPDATE_POLYLINE,
    payload,
  };
}
/**
 * Updates map on click. Used to set a pointer on the map
 * @param {*} lat : latitude - float
 * @param {*} lng : longitude - float
 */
export function updateOnClick(lat, lng) {
  return {
    type: MAP_ONCLICK,
    payload: {
      lat,
      lng,
    },
  };
}
