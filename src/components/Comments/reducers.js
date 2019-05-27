import {
  WS_NEW_COMMENT_RECEIVED,
  COMMENTS_FETCH_THREAD,
  COMMENTS_FETCH_THREAD_SUCCESS,
  COMMENTS_POST_TO_THREAD,
  COMMENTS_POST_TO_THREAD_ERROR,
} from './actionTypes';

const initialState = {
  threadId: null,
  loading: true,
  commentButtonLoading: false,
  errors: false,
  message: null,
  comments: {},
  userData: {},
};

const sortComments = (a, b) => {
  if (a.timestamp < b.timestamp) {
    return -1;
  }
  if (a.timestamp > b.timestamp) {
    return 1;
  }
  return 0;
}

function commentsReducer(state = initialState, action) {
  if (action.type === COMMENTS_FETCH_THREAD) {
    const loading = action.payload.showLoader && state.threadId !== action.payload.threadId
    return {
      ...state,
      threadId: action.payload.threadId,
      loading,
    };
  }
  if (action.type === WS_NEW_COMMENT_RECEIVED) {
    const objComments = action.payload.comments;
    const comment = Object.keys(objComments).map(key => ({
      key,
      ...objComments[key],
    }));

    const comments = [comment[0], ...state.comments];
    const { userData } = state;
    const userDataKey = Object.keys(action.payload.userData)[0];
    const insert = Object.keys(state.userData).filter(key => key === userDataKey).length === 0;

    if (insert) {
      userData[userDataKey] = action.payload.userData[userDataKey];
    }
    comments.sort(sortComments);
    return {
      ...state,
      loading: false,
      comments,
      userData,
      commentButtonLoading: false,
    };
  }
  if (action.type === COMMENTS_FETCH_THREAD_SUCCESS) {
    const objComments = action.payload.comments;
    const comments = Object.keys(objComments).map(key => ({
      key,
      ...objComments[key],
    }));

    comments.sort(sortComments);

    return {
      ...state,
      loading: false,
      comments,
      userData: action.payload.userData,
      commentButtonLoading: false,
    };
  }
  if (action.type === COMMENTS_POST_TO_THREAD) {
    return {
      ...state,
      commentButtonLoading: true,
    };
  }
  if (action.type === COMMENTS_POST_TO_THREAD_ERROR) {
    return {
      ...state,
      commentButtonLoading: false,
      errors: true,
      message: action.payload.detail,
    };
  }
  return state;
}

export default commentsReducer;
