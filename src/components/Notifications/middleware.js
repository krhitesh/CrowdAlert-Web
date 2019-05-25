/* global window */
import {
  NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK,
} from './actionTypes';
import { AUTH_CHECK_USER_STATUS } from '../../containers/Auth/actionTypes';
import { fetchEventsByLocationFinished } from '../../containers/Feed/actions';
import {
  showNotificationPermissionInit,
  showNotificationPermissionGranted,
  showNotificationPermissionDenied,
  showNotificationPermissionClose,
  sendFCMTokenToServer,
} from './actions';
import { fetchCommentsThread } from '../Comments/actions';

import { messaging } from '../../utils/firebase';

const notificationsMiddleware = store => next => (action) => {
  const { dispatch } = store;
  if (action.type === AUTH_CHECK_USER_STATUS) {
    // Check if fcm token is not present
    if (!window.localStorage.getItem('fcmtoken')) {
      // Show modal to promt the user to subscribe to notificaitons
      dispatch(showNotificationPermissionInit());
    }
  }
  if (action.type === NOTIFICATIONS_RECIEVIED_NEW_MESSAGE) {
    next(action);
    const state = store.getState();
    const { zoom } = state.map;
    const { data } = action.payload;

    if (data['gcm.notification.type'] === 'incident') {
      dispatch(fetchEventsByLocationFinished({
        payload: {
          zoom,
        },
        response: [{
          key: data['gcm.notification.uuid'],
          lat: parseFloat(data['gcm.notification.lat']),
          long: parseFloat(data['gcm.notification.long']),
          category: data['gcm.notification.category'],
          title: data['gcm.notification.user_text'],
          datetime: parseInt(data['gcm.notification.datetime'], 10),
        }],
      }));
    }
    if (data['gcm.notification.type'] === 'comment') {
      // If there is a comment, fetch the thread again
      // Thread id is event id
      dispatch(fetchCommentsThread(data['gcm.notification.thread_id'], false));
    }
  }
  if (action.type === NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK) {
    // Continue to the next middleware
    next(action);
    messaging.requestPermission()
      .then(() => {
        console.log('Permission Granted');
        // If permission is granted, close the modal
        dispatch(showNotificationPermissionClose());
        return messaging.getToken();
      })
      .then((token) => {
        // Save the token
        window.localStorage.setItem('fcmtoken', token);
        // Send the new token to server
        dispatch(sendFCMTokenToServer(token));
        // Save as permission granted
        dispatch(showNotificationPermissionGranted(token));
        console.log(token);
      })
      .catch((err) => {
        // Show error prompt
        dispatch(showNotificationPermissionDenied());
        console.log('Error', err);
      });
  }
  next(action);
};

export default notificationsMiddleware;
