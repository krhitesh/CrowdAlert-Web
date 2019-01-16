import {
  NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
  NOTIFICATIONS_SEND_TOKEN_TO_SERVER,
  NOTIFICATIONS_SEND_TOKEN_TO_SERVER_SUCCESS,
  NOTIFICATIONS_SEND_TOKEN_TO_SERVER_ERROR,
  NOTIFICATIONS_MARK_AS_READ,
} from './actionTypes';

export function receivedNewNotification({ data }) {
  return {
    type: NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
    payload: {
      data,
    },
  };
}
export function showNotificationPermissionInit() {
  return {
    type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
  };
}
export function showNotificationPermissionAsk() {
  return {
    type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK,
  };
}
export function showNotificationPermissionGranted() {
  return {
    type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
  };
}
export function showNotificationPermissionDenied() {
  return {
    type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
  };
}
export function showNotificationPermissionClose() {
  return {
    type: NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
  };
}
export function sendFCMTokenToServer(fcmtoken) {
  return {
    type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER,
    payload: {
      fcmtoken,
    },
  };
}
export function sendFCMTokenToServerSuccess() {
  return {
    type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_SUCCESS,
  };
}
export function sendFCMTokenToServerError(error) {
  return {
    type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_ERROR,
    payload: {
      error,
    },
  };
}
export function markNotificationAsRead() {
  return {
    type: NOTIFICATIONS_MARK_AS_READ,
  };
}
