import {
  UPDATE_UPVOTES_LONG_POLL_STATUS,
  FETCH_UPVOTES_START,
  FETCH_UPVOTES_CANCEL,
  FETCH_UPVOTES_ERROR,
  FETCH_UPVOTES_SUCCESS,
  UPDATE_UPVOTE_START,
  UPDATE_UPVOTE_SUCCESS,
  UPDATE_UPVOTE_ERROR,
  UPDATE_UPVOTE_CANCEL,
} from '../actionTypes';
import {
  updateUpvoteCancel,
  updateUpvoteStart,
  updateUpvoteSuccess,
  updateUpvotesLongPollStatus,
  upvoteUpvoteError,
  fetchUpvotesCancel,
  fetchUpvotesError,
  fetchUpvotesStart,
  fetchUpvotesSuccess,
} from '../actions';

describe('testing upvote actions', () => {
  test('fetchUpvotesCancel', () => {
    const action = fetchUpvotesCancel();
    expect(action).toEqual({
      type: FETCH_UPVOTES_CANCEL,
    });
  });

  test('updateUpvoteCancel', () => {
    const action = updateUpvoteCancel();
    expect(action).toEqual({
      type: UPDATE_UPVOTE_CANCEL,
    });
  });

  test('updateUpvotesLongPollStatus', () => {
    const status = true;
    const action = updateUpvotesLongPollStatus(status);
    expect(action).toEqual({
      type: UPDATE_UPVOTES_LONG_POLL_STATUS,
      payload: {
        status
      }
    });
  });

  test('fetchUpvotesStart', () => {
    const payload = {
      uuid: 'uuid',
      currentCount: 0,
      initialRequest: true
    };
    const action = fetchUpvotesStart(payload.uuid, payload.currentCount, payload.initialRequest);
    expect(action).toEqual({
      type: FETCH_UPVOTES_START,
      payload
    });
  });

  test('fetchUpvotesSuccess', () => {
    const payload = {
      response: {
        uuid: 'G51PfyBx0scM4BwU02yB',
        count: 0,
        has_upvoted: false
      }
    };
    const action = fetchUpvotesSuccess(payload);
    expect(action).toEqual({
      type: FETCH_UPVOTES_SUCCESS,
      payload
    });
  });

  test('fetchUpvotesError', () => {
    const payload = {
      message: 'error'
    };
    const action = fetchUpvotesError(payload);
    expect(action).toEqual({
      type: FETCH_UPVOTES_ERROR,
      payload
    });
  });

  test('updateUpvoteStart', () => {
    const payload = {
      uuid: 'uuid'
    };
    const action = updateUpvoteStart(payload.uuid);
    expect(action).toEqual({
      type: UPDATE_UPVOTE_START,
      payload
    });
  });

  test('updateUpvoteSuccess', () => {
    const payload = {
      response: {
        uuid: 'G51PfyBx0scM4BwU02yB',
        count: 0,
        has_upvoted: false
      }
    };
    const action = updateUpvoteSuccess(payload);
    expect(action).toEqual({
      type: UPDATE_UPVOTE_SUCCESS,
      payload
    });
  });

  test('upvoteUpvoteError', () => {
    const payload = {
      message: 'error'
    };
    const action = upvoteUpvoteError(payload);
    expect(action).toEqual({
      type: UPDATE_UPVOTE_ERROR,
      payload
    });
  });
});
