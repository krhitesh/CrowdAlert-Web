import {
  UPDATE_UPVOTES_LONG_POLL_STATUS,
  FETCH_UPVOTES_SUCCESS,
  UPDATE_UPVOTE_SUCCESS,
} from '../actionTypes';
import upvotesReducer from '../reducers';

const initialState = {
  upvoteData: {},
  errors: false,
  message: null,
  longpoll: false,
};

describe('testing upvotes reducer', () => {
  it('no change when no action is passed', () => {
    const ns = upvotesReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  it('fetch upvotes success action', () => {
    const action = {
      type: FETCH_UPVOTES_SUCCESS,
      payload: {
        response: {
          uuid: 'G51PfyBx0scM4BwU02yB',
          count: 0,
          has_upvoted: false,
        },
      },
    };

    const ns = upvotesReducer(initialState, action);

    const { uuid, has_upvoted: hasUpvoted, count } = action.payload.response;
    expect(ns).toEqual({
      ...initialState,
      upvoteData: {
        ...initialState.upvoteData,
        [uuid]: {
          uuid,
          hasUpvoted,
          count,
        },
      },
    });
  });

  it('update upvotes success action', () => {
    const action = {
      type: UPDATE_UPVOTE_SUCCESS,
      payload: {
        response: {
          uuid: 'G51PfyBx0scM4BwU02yB',
          count: 0,
          has_upvoted: false,
        },
      },
    };

    const ns = upvotesReducer(initialState, action);

    const { uuid, has_upvoted: hasUpvoted, count } = action.payload.response;
    expect(ns).toEqual({
      ...initialState,
      upvoteData: {
        ...initialState.upvoteData,
        [uuid]: {
          uuid,
          hasUpvoted,
          count,
        },
      },
    });
  });

  it('update long poll status action', () => {
    const action = {
      type: UPDATE_UPVOTES_LONG_POLL_STATUS,
      payload: {
        status: true,
      },
    };

    const ns = upvotesReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      longpoll: action.payload.status,
    });
  });
});
