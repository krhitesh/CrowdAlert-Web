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
} from '../actionTypes';
import {
  receivedNewNotification,
  markNotificationAsRead,
  sendFCMTokenToServer,
  sendFCMTokenToServerError,
  sendFCMTokenToServerSuccess,
  showNotificationPermissionAsk,
  showNotificationPermissionClose,
  showNotificationPermissionDenied,
  showNotificationPermissionGranted,
  showNotificationPermissionInit
} from '../actions';

describe('testing notifications actions', () => {
  test('receivedNewNotification', () => {
    const data = {};
    const action = receivedNewNotification({ data });
    expect(action).toEqual({
      type: NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
      payload: {
        data
      }
    });
  });

  test('showNotificationPermissionInit', () => {
    const action = showNotificationPermissionInit();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
    });
  });

  test('showNotificationPermissionAsk', () => {
    const action = showNotificationPermissionAsk();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK,
    });
  });

  test('showNotificationPermissionGranted', () => {
    const action = showNotificationPermissionGranted();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
    });
  });

  test('showNotificationPermissionDenied', () => {
    const action = showNotificationPermissionDenied();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
    });
  });

  test('showNotificationPermissionClose', () => {
    const action = showNotificationPermissionClose();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
    });
  });

  test('sendFCMTokenToServer', () => {
    const fcmtoken = 'token';
    const action = sendFCMTokenToServer(fcmtoken);
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER,
      payload: {
        fcmtoken
      }
    });
  });

  test('sendFCMTokenToServerSuccess', () => {
    const action = sendFCMTokenToServerSuccess();
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_SUCCESS,
    });
  });

  test('sendFCMTokenToServerError', () => {
    const error = new Error('testing "sendFCMTokenToServerError" action');
    const action = sendFCMTokenToServerError(error);
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_ERROR,
      payload: {
        error
      }
    });
  });

  test('markNotificationAsRead', () => {
    const action = markNotificationAsRead();
    expect(action).toEqual({
      type: NOTIFICATIONS_MARK_AS_READ,
    });
  });
});