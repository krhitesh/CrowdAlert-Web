import {
  NOTIFICATIONS_RECIEVIED_NEW_MESSAGE,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED,
  NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE,
  NOTIFICATIONS_MARK_AS_READ,
} from './actionTypes';

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

function notificationsReducer(state = initialState, action) {
  if (action.type === NOTIFICATIONS_RECIEVIED_NEW_MESSAGE) {
    const { data } = action.payload;
    return {
      ...state,
      unread: true,
      notifications: {
        ...state.notifications,
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
    };
  }
  if (action.type === NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_INIT) {
    return {
      ...state,
      modal: {
        ...state.modal,
        open: true,
        text: modalText.text.prompt,
        header: modalText.header.prompt,
        icon: modalText.icon.prompt,
      },
    };
  }
  if (action.type === NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_GRANTED) {
    return {
      ...state,
      permission: true,
    };
  }
  if (action.type === NOTIFICATIONS_SHOW_NOTIFICATIONS_PERMISSION_DENIED) {
    return {
      ...state,
      permission: false,
      modal: {
        ...state.modal,
        open: true,
        text: modalText.text.denied,
        header: modalText.header.denied,
        icon: modalText.icon.denied,
      },
    };
  }
  if (action.type === NOTIFICATIONS_SHOW_NOTIFICATIONS_CLOSE) {
    return {
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    };
  }
  if (action.type === NOTIFICATIONS_MARK_AS_READ) {
    return {
      ...state,
      unread: false,
    };
  }
  return state;
}

export default notificationsReducer;
