import {
  NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
  NOTIFICATIONS_MARK_AS_READ,
} from '../actionTypes';
import notificationsReducer from '../reducers';

const modalText = {
  header: {
    success: 'Thank you for enabling notifications.',
    prompt: 'Get immediate alerts for important incidents nearby',
    denied: 'Sorry! You won\'t recieve any important alerts',
  },
  text: {
    success: 'We will try to serve you important incidents that are nearby',
    prompt: 'Enable notifications to get updated about what\'s happening around you',
    denied: 'You need to enable notifications manually in order to receive updates',
  },
  icon: {
    success: 'check',
    prompt: 'bell',
    denied: 'bell slash outline',
  },
};

const initialState = {
  permission: null,
  unread: false,
  modal: {
    open: false,
    text: null,
    header: null,
  },
  notifications: {},
};

describe('testing notifications reducer', () => {
  it('no change when no action is passed', () => {
    const ns = notificationsReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  it('recieved new message action', () => {
    const action = {
      type: NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
      payload: {
        data: {
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
        },
      },
    };

    const ns = notificationsReducer(initialState, action);

    const { data } = action.payload;
    expect(ns).toEqual({
      ...initialState,
      unread: true,
      notifications: {
        ...initialState.notifications,
        [data['gcm.notification.uuid']]: {
          key: data['gcm.notification.uuid'],
          link: data['gcm.notification.link'],
          lat: parseFloat(data['gcm.notification.lat']),
          long: parseFloat(data['gcm.notification.long']),
          category: data['gcm.notification.category'],
          title: data['gcm.notification.user_text'],
          type: data['gcm.notification.type'],
          datetime: parseInt(data['gcm.notification.datetime'], 10),
          userName: data['gcm.notification.user_name'],
          userPicture: data['gcm.notification.user_picture'],
        },
      },
    });
  });

  it('permission init action', () => {
    const action = {
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
      payload: {},
    };

    const ns = notificationsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modal: {
        ...initialState.modal,
        open: true,
        text: modalText.text.prompt,
        header: modalText.header.prompt,
        icon: modalText.icon.prompt,
      },
    });
  });

  it('permission granted action', () => {
    const action = {
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
      payload: {},
    };

    const ns = notificationsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      permission: true,
    });
  });

  it('permission denied action', () => {
    const action = {
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
      payload: {},
    };

    const ns = notificationsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      permission: false,
      modal: {
        ...initialState.modal,
        open: true,
        text: modalText.text.denied,
        header: modalText.header.denied,
        icon: modalText.icon.denied,
      },
    });
  });

  it('notification close action', () => {
    const action = {
      type: NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
      payload: {},
    };

    const ns = notificationsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modal: {
        ...initialState.modal,
        open: false,
      },
    });
  });

  it('mark as read action', () => {
    const action = {
      type: NOTIFICATIONS_MARK_AS_READ,
      payload: {},
    };

    const ns = notificationsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      unread: false,
    });
  });
});
