import {
  SPAM_REPORT_REPORT_SPAM_START,
  SPAM_REPORT_REPORT_SPAM_SUCCESS,
  SPAM_REPORT_REPORT_SPAM_ERROR,
  SPAM_REPORT_REPORT_SPAM_CANCEL,
  SPAM_REPORT_MODAL_OPEN,
  SPAM_REPORT_MODAL_CLOSE,
} from './actionTypes';

export function reportSpamStart(uuid) {
  return {
    type: SPAM_REPORT_REPORT_SPAM_START,
    payload: {
      uuid,
    },
  };
}
export function reportSpamSuccess({ response }) {
  return {
    type: SPAM_REPORT_REPORT_SPAM_SUCCESS,
    payload: {
      response,
    },
  };
}
export function reportSpamError(response) {
  if (response.status === 403) {
    return {
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        message: 'You are not allowed to flag an incident. Make sure your account is verified',
      },
    };
  }
  return {
    type: SPAM_REPORT_REPORT_SPAM_ERROR,
    payload: {
      message: response.message,
    },
  };
}
export function reportSpamCancel() {
  return {
    type: SPAM_REPORT_REPORT_SPAM_CANCEL,
  };
}
export function reportSpamModalOpen(message) {
  return {
    type: SPAM_REPORT_MODAL_OPEN,
    payload: {
      message,
    },
  };
}
export function reportSpamModalClose() {
  return {
    type: SPAM_REPORT_MODAL_CLOSE,
  };
}
