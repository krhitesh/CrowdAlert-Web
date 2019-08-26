import {
  UPDATE_UPVOTES_LONG_POLL_STATUS,
  FETCH_UPVOTES_SUCCESS,
  UPDATE_UPVOTE_SUCCESS,
} from './actionTypes';

const initialState = {
  upvoteData: {},
  errors: false,
  message: null,
  longpoll: false,
};

function upvotesReducer(state = initialState, action) {
  if (
    action.type === FETCH_UPVOTES_SUCCESS
    || action.type === UPDATE_UPVOTE_SUCCESS
  ) {
    const { uuid, has_upvoted: hasUpvoted, count } = action.payload.response;
    return {
      ...state,
      upvoteData: {
        ...state.upvoteData,
        [uuid]: {
          uuid,
          hasUpvoted,
          count,
        },
      },
    };
  }
  if (action.type === UPDATE_UPVOTES_LONG_POLL_STATUS) {
    return {
      ...state,
      longpoll: action.payload.status,
    };
  }

  return state;
}

export default upvotesReducer;
