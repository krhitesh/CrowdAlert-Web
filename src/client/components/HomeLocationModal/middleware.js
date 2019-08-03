import { HOME_LOCATION_SAVE_LOCATION_SUCCESS } from './actionTypes';
import { geolocatorUpdateHomeLocation } from '../Geolocator/actions';

const homeLocationMiddleware = ({ dispatch }) => next => (action) => {
  if (action.type === HOME_LOCATION_SAVE_LOCATION_SUCCESS) {
    dispatch(geolocatorUpdateHomeLocation(action.payload));
  }

  next(action);
};

export default homeLocationMiddleware;
