import {
  SPAM_REPORT_REPORT_SPAM_START,
  SPAM_REPORT_REPORT_SPAM_SUCCESS,
  SPAM_REPORT_REPORT_SPAM_ERROR,
  SPAM_REPORT_REPORT_SPAM_CANCEL,
  SPAM_REPORT_MODAL_OPEN,
  SPAM_REPORT_MODAL_CLOSE,
} from '../actionTypes';
import {
  reportSpamCancel,
  reportSpamError,
  reportSpamModalClose,
  reportSpamModalOpen,
  reportSpamStart,
  reportSpamSuccess
} from '../actions';

describe('testing spam report actions', () => {
  test('reportSpamStart', () => {
    const payload = {
      uuid: 'uuid'
    };
    const action = reportSpamStart(payload.uuid);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_START,
      payload
    });
  });

  test('reportSpamSuccess', () => {
    const payload = {
      response: {
        'status': 'ok'
      }
    };
    const action = reportSpamSuccess(payload);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_SUCCESS,
      payload
    });
  });

  test('reportSpamError', () => {
    const response = {
      status: 403
    };
    const action = reportSpamError(response);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        message: 'You are not allowed to flag an incident. Make sure your account is verified',
      }
    });
  });

  test('reportSpamError', () => {
    const response = {
      status: 200,
      message: '',
    };
    const action = reportSpamError(response);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        message: response.message,
      },
    });
  });

  test('reportSpamCancel', () => {
    const action = reportSpamCancel();
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_CANCEL,
    });
  });

  test('reportSpamModalOpen', () => {
    const payload = {
      message: 'message'
    };
    const action = reportSpamModalOpen(payload.message);
    expect(action).toEqual({
      type: SPAM_REPORT_MODAL_OPEN,
      payload
    });
  });

  test('reportSpamModalClose', () => {
    const action = reportSpamModalClose();
    expect(action).toEqual({
      type: SPAM_REPORT_MODAL_CLOSE,
    });
  });
});