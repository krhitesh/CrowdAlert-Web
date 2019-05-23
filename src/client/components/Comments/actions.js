import axios from 'axios';
import {
  COMMENTS_FETCH_THREAD,
  COMMENTS_FETCH_THREAD_SUCCESS,
  COMMENTS_FETCH_THREAD_CANCEL,
  COMMENTS_FETCH_THREAD_ERROR,
  COMMENTS_POST_TO_THREAD,
  COMMENTS_POST_TO_THREAD_SUCCESS,
  COMMENTS_POST_TO_THREAD_CANCEL,
  COMMENTS_POST_TO_THREAD_ERROR,
  COMMENTS_FETCH_THREAD_SSR,
} from './actionTypes';
import { COMMENTS } from '../../utils/apipaths';

export function fetchCommentsThread(threadId, showLoader) {
  return {
    type: COMMENTS_FETCH_THREAD,
    payload: {
      threadId,
      showLoader,
    },
    meta: {
      ajax: true,
    },
  };
}
export function fetchCommentsThreadSuccess(payload) {
  return {
    type: COMMENTS_FETCH_THREAD_SUCCESS,
    payload,
  };
}
export function fetchCommnetsThreadError(payload) {
  return {
    type: COMMENTS_FETCH_THREAD_ERROR,
    payload,
  };
}
export const fetchCommentsThreadSSR = (threadId, showLoader) => async (dispatch, getState) => {
  const apiUrl = `${COMMENTS}?thread=${threadId}`;
  try {
    const { data } = await axios.get(apiUrl);
    dispatch({
      type: COMMENTS_FETCH_THREAD_SSR,
      payload: {
        threadId,
        showLoader,
      },
      meta: {
        ajax: false,
      },
    });
    dispatch(fetchCommentsThreadSuccess(data));
  } catch (err) {
    dispatch({
      type: COMMENTS_FETCH_THREAD_SSR,
      payload: {
        threadId,
        showLoader,
      },
      meta: {
        ajax: false,
      },
    });
    dispatch(fetchCommnetsThreadError(err));
  }
};
export function fetchCommentsThreadCancel() {
  return {
    type: COMMENTS_FETCH_THREAD_CANCEL,
  };
}
export function postCommentToThread(comment, threadId) {
  return {
    type: COMMENTS_POST_TO_THREAD,
    payload: {
      comment,
      threadId,
    },
    meta: {
      ajax: true,
    },
  };
}
export function postCommentToThreadSuccess(payload) {
  return {
    type: COMMENTS_POST_TO_THREAD_SUCCESS,
    payload,
  };
}
export function postCommentToThreadError(payload) {
  return {
    type: COMMENTS_POST_TO_THREAD_ERROR,
    payload,
  };
}
export function postCommnetToThreadCancel() {
  return {
    type: COMMENTS_POST_TO_THREAD_CANCEL,
  };
}

