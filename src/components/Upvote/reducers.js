import {
  FETCH_UPVOTES_SUCCESS,
  UPDATE_UPVOTE_SUCCESS,
} from './actionTypes';

const initialState = {
  upvoteData: {},
  errors: false,
  message: null,
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

  return state;
}

export default upvotesReducer;
