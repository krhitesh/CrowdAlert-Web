import {
  SPAM_REPORT_REPORT_SPAM_SUCCESS,
  SPAM_REPORT_REPORT_SPAM_ERROR,
  SPAM_REPORT_MODAL_CLOSE,
  SPAM_REPORT_MODAL_OPEN,
} from './actionTypes';

const successText = 'Flagging potentially malicous incidents helps other people to use CrowdAlert safely. Thank You!';

const initialState = {
  errors: false,
  message: null,
  modal: {
    open: false,
  },
};

function spamReportReducer(state = initialState, action) {
  if (action.type === SPAM_REPORT_MODAL_CLOSE) {
    return {
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    };
  }
  if (action.type === SPAM_REPORT_MODAL_OPEN) {
    return {
      ...state,
      modal: {
        ...state.modal,
        open: true,
      },
    };
  }
  if (action.type === SPAM_REPORT_REPORT_SPAM_SUCCESS) {
    return {
      ...state,
      errors: false,
      modal: {
        ...state.modal,
        open: true,
      },
      message: successText,
    };
  }
  if (action.type === SPAM_REPORT_REPORT_SPAM_ERROR) {
    return {
      ...state,
      errors: true,
      modal: {
        ...state.modal,
        open: true,
      },
      message: action.payload.message,
    };
  }
  return state;
}

export default spamReportReducer;
