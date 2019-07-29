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
  showNotificationPermissionInit,
} from '../actions';

describe('testing notifications actions', () => {
  it('receivedNewNotification', () => {
    const data = {
      'gcm.notification.uuid': 'uuid',
      'gcm.notification.link': 'link',
      'gcm.notification.lat': 26.3432,
      'gcm.notification.long': 80.3423,
      'gcm.notification.category': 'category',
      'gcm.notification.user_text': 'user text',
      'gcm.notification.type': 'type',
      'gcm.notification.datetime': new Date().getTime(),
      'gcm.notification.user_name': 'user name',
      'gcm.notification.user_picture': 'user picture',
    };
    const action = receivedNewNotification({ data });
    expect(action).toEqual({
      type: NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
      payload: {
        data,
      },
    });
  });

  it('showNotificationPermissionInit', () => {
    const action = showNotificationPermissionInit();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
    });
  });

  it('showNotificationPermissionAsk', () => {
    const action = showNotificationPermissionAsk();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_ASK,
    });
  });

  it('showNotificationPermissionGranted', () => {
    const action = showNotificationPermissionGranted();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
    });
  });

  it('showNotificationPermissionDenied', () => {
    const action = showNotificationPermissionDenied();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
    });
  });

  it('showNotificationPermissionClose', () => {
    const action = showNotificationPermissionClose();
    expect(action).toEqual({
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
    });
  });

  it('sendFCMTokenToServer', () => {
    const fcmtoken = 'token';
    const action = sendFCMTokenToServer(fcmtoken);
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER,
      payload: {
        fcmtoken,
      },
    });
  });

  it('sendFCMTokenToServerSuccess', () => {
    const action = sendFCMTokenToServerSuccess();
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_SUCCESS,
    });
  });

  it('sendFCMTokenToServerError', () => {
    const error = new Error('testing "sendFCMTokenToServerError" action');
    const action = sendFCMTokenToServerError(error);
    expect(action).toEqual({
      type: NOTIFICATIONS_SEND_TOKEN_TO_SERVER_ERROR,
      payload: {
        error,
      },
    });
  });

  it('markNotificationAsRead', () => {
    const action = markNotificationAsRead();
    expect(action).toEqual({
      type: NOTIFICATIONS_MARK_AS_READ,
    });
  });
});
