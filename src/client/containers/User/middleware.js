import { USER_DELETE_USER_SUCCESS, USER_UPDATE_USER_CREDENTIALS_SUCCESS, USER_GET_INFO_SUCCESS } from './actionTypes';
import { logoutUserAuthencation } from '../Auth/actions';
import { geolocatorUpdateHomeLocation } from '../../components/Geolocator/actions';

const userMiddleware = ({ dispatch }) => next => (action) => {
  if (action.type === USER_DELETE_USER_SUCCESS) {
    dispatch(logoutUserAuthencation());
    // Deploy a cloud function trigger Auth.onDelete to delete user record
    // from firestore
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
