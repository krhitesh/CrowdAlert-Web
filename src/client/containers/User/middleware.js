import { USER_DELETE_USER_SUCCESS, USER_UPDATE_USER_CREDENTIALS_SUCCESS, USER_GET_INFO_SUCCESS } from './actionTypes';
import { logoutUserAuthencation } from '../Auth/actions';
import { geolocatorUpdateHomeLocation } from '../../components/Geolocator/actions';

const userMiddleware = ({ dispatch }) => next => (action) => {
  if (action.type === USER_DELETE_USER_SUCCESS) {
    dispatch(logoutUserAuthencation());
    // A cloud function trigger is set Auth.onDelete to add a field "deleted" to user record
    // in firestore
  } if (action.type === USER_UPDATE_USER_CREDENTIALS_SUCCESS) {
    dispatch(logoutUserAuthencation());
  } else if (action.type === USER_GET_INFO_SUCCESS) {
    dispatch(geolocatorUpdateHomeLocation(action.payload));
    next(action);
  } else {
    next(action);
  }
};

export default userMiddleware;
