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
  reportSpamSuccess,
} from '../actions';

describe('testing spam report actions', () => {
  it('reportSpamStart', () => {
    const payload = {
      uuid: 'uuid',
    };
    const action = reportSpamStart(payload.uuid);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_START,
      payload,
    });
  });

  it('reportSpamSuccess', () => {
    const payload = {
      response: {
        status: 'ok',
      },
    };
    const action = reportSpamSuccess(payload);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_SUCCESS,
      payload,
    });
  });

  it('reportSpamError', () => {
    const response = {
      status: 403,
    };
    const action = reportSpamError(response);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        message: 'You are not allowed to flag an incident. Make sure your account is verified',
      },
    });
  });

  it('report spam error', () => {
    const response = {
      status: 200,
      response: {
        detail: {},
      },
    };
    const action = reportSpamError(response);
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_ERROR,
      payload: {
        message: response.response.detail,
      },
    });
  });

  it('reportSpamCancel', () => {
    const action = reportSpamCancel();
    expect(action).toEqual({
      type: SPAM_REPORT_REPORT_SPAM_CANCEL,
    });
  });

  it('reportSpamModalOpen', () => {
    const payload = {
      message: 'message',
    };
    const action = reportSpamModalOpen(payload.message);
    expect(action).toEqual({
      type: SPAM_REPORT_MODAL_OPEN,
      payload,
    });
  });

  it('reportSpamModalClose', () => {
    const action = reportSpamModalClose();
    expect(action).toEqual({
      type: SPAM_REPORT_MODAL_CLOSE,
    });
  });
});
