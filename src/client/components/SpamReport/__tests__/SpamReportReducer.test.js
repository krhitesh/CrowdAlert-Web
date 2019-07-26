import {
  SPAM_REPORT_REPORT_SPAM_SUCCESS,
  SPAM_REPORT_REPORT_SPAM_ERROR,
  SPAM_REPORT_MODAL_CLOSE,
  SPAM_REPORT_MODAL_OPEN,
} from '../actionTypes';
import spamReportReducer from '../reducers';

const successText = 'Flagging wrongly or maliciously reported incidents helps other people to use CrowdAlert safely. Thank You!';

const initialState = {
  errors: false,
  message: null,
  modal: {
    open: false,
  },
};

describe('testing spam report reducer', () => {
  test('no change when no action is passed', () => {
    const ns = spamReportReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('modal close action', () => {
    const action = {
      type: SPAM_REPORT_MODAL_CLOSE,
      payload: {}
    };

    const ns = spamReportReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modal: {
        ...initialState.modal,
        open: false,
      },
    });
  });

  test('modal open action', () => {
    const action = {
      type: SPAM_REPORT_MODAL_OPEN,
      payload: {
        message: 'message'
      }
    };

    const ns = spamReportReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      modal: {
        ...initialState.modal,
        open: true,
      },
    });
  });

  test('report success action', () => {
    const action = {
      type: SPAM_REPORT_REPORT_SPAM_SUCCESS,
      payload: {
        response: {
          'status': 'ok'
        }
      }
    };

    const ns = spamReportReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      errors: false,
      modal: {
        ...initialState.modal,
        open: true,
      },
      message: successText,
    });
  });

  test('report error action', () => {
    const action = {
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        status: 403
      }
    };

    const ns = spamReportReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      errors: true,
      modal: {
        ...initialState.modal,
        open: true,
      },
      message: action.payload.message
    });
  });
});