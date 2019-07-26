import {
  WS_NEW_COMMENT_RECEIVED,
  COMMENTS_FETCH_THREAD,
  COMMENTS_FETCH_THREAD_SUCCESS,
  COMMENTS_POST_TO_THREAD,
  COMMENTS_POST_TO_THREAD_ERROR,
} from '../actionTypes';
import commentsReducer from '../reducers';

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

describe('testing comments reducer', () => {
  test('no change when no action is passed', () => {
    const ns = commentsReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('new comment via web socket action', () => {
    const action = {
      type: WS_NEW_COMMENT_RECEIVED,
      payload: {
        userData: {
          kwKpnj5y0ZR4QlAkTO4IGKHqsdY2: {
            displayName: 'Hitesh Kumar',
            photoURL: 'https://lh4.googleusercontent.com/-peeRetkut0g/AAAAAAAAAAI/AAAAAAAAEIM/Ss8Rhw2EMjY/photo.jpg'
          }
        },
        comments: {
          '7gIxAGXrNIk4kAlMBLbB': {
            text: 'test',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562603760294.58,
            spam: {
              uuid: '7gIxAGXrNIk4kAlMBLbB',
              count: 0,
              toxic: {}
            }
          }
        }
      }
    };

    const ns = commentsReducer(initialState, action);

    const objComments = action.payload.comments;
    const comment = Object.keys(objComments).map(key => ({
      key,
      ...objComments[key],
    }));

    const comments = [comment[0], ...initialState.comments];
    const { userData } = initialState;
    const userDataKey = Object.keys(action.payload.userData)[0];
    const insert = Object.keys(initialState.userData).filter(key => key === userDataKey).length === 0;

    if (insert) {
      userData[userDataKey] = action.payload.userData[userDataKey];
    }
    comments.sort(sortComments);
    expect(ns).toEqual({
      ...initialState,
      loading: false,
      comments,
      userData,
      commentButtonLoading: false,
    });
  });

  test('fetch thread action', () => {
    const action = {
      type: COMMENTS_FETCH_THREAD,
      payload: {
        threadId: '',
        showLoader: true
      }
    };

    const ns = commentsReducer(initialState, action);

    const loading = action.payload.showLoader && initialState.threadId !== action.payload.threadId;
    expect(ns).toEqual({
      ...initialState,
      threadId: action.payload.threadId,
      loading
    });
  });

  test('fetch thread success action', () => {
    const action = {
      type: COMMENTS_FETCH_THREAD_SUCCESS,
      payload: {
        userData: {
          kwKpnj5y0ZR4QlAkTO4IGKHqsdY2: {
            displayName: 'Hitesh Kumar',
            photoURL: 'https://lh4.googleusercontent.com/-peeRetkut0g/AAAAAAAAAAI/AAAAAAAAEIM/Ss8Rhw2EMjY/photo.jpg'
          }
        },
        comments: {
          G51PfyBx0scM4BwU02yB: {
            timestamp: 1562604350162.7769,
            text: 'final?',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            spam: {
              uuid: 'G51PfyBx0scM4BwU02yB',
              count: 0,
              toxic: {}
            }
          },
          HIuwwlBlQqacTASx6ru1: {
            text: 'zxczcasdasdqwe asdasd',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562604266090.816,
            spam: {
              uuid: 'HIuwwlBlQqacTASx6ru1',
              count: 0,
              toxic: {}
            }
          },
          h5OccHpYTVK8Xcmd93Pl: {
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562604266041.2158,
            text: 'adasdazxczxc',
            spam: {
              uuid: 'h5OccHpYTVK8Xcmd93Pl',
              count: 0,
              toxic: {}
            }
          },
          tbfmeBxHkh41HBH9yJwy: {
            text: 'asdasd',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562604230980.323,
            spam: {
              uuid: 'tbfmeBxHkh41HBH9yJwy',
              count: 0,
              toxic: {}
            }
          },
          Wq0UwEqpX7IwNpzUgLRI: {
            text: 'zxczxczc',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562604195755.021,
            spam: {
              uuid: 'Wq0UwEqpX7IwNpzUgLRI',
              count: 0,
              toxic: {}
            }
          },
          '4zZo8OF7nvkIVrS1SYab': {
            text: 'asdasdad',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562604181749.315,
            spam: {
              uuid: '4zZo8OF7nvkIVrS1SYab',
              count: 0,
              toxic: {}
            }
          },
          VGYKU1xJ9nmAMe08NQQr: {
            timestamp: 1562604098825.726,
            text: 'testong',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            spam: {
              uuid: 'VGYKU1xJ9nmAMe08NQQr',
              count: 0,
              toxic: {}
            }
          },
          jdwCv07LI2ujk0qNNTXW: {
            text: 'testing 2',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562603840325.847,
            spam: {
              uuid: 'jdwCv07LI2ujk0qNNTXW',
              count: 0,
              toxic: {}
            }
          },
          '7gIxAGXrNIk4kAlMBLbB': {
            text: 'test',
            user: 'kwKpnj5y0ZR4QlAkTO4IGKHqsdY2',
            timestamp: 1562603760294.58,
            spam: {
              uuid: '7gIxAGXrNIk4kAlMBLbB',
              count: 0,
              toxic: {}
            }
          }
        }
      }
    };

    const ns = commentsReducer(initialState, action);

    const objComments = action.payload.comments;
    const comments = Object.keys(objComments).map(key => ({
      key,
      ...objComments[key],
    }));
    comments.sort(sortComments);
    expect(ns).toEqual({
      ...initialState,
      loading: false,
      comments,
      userData: action.payload.userData,
      commentButtonLoading: false,
    });
  });

  test('post to thread action', () => {
    const action = {
      type: COMMENTS_POST_TO_THREAD,
      payload: {
        comment: 'comment',
        threadId: 'threadId'
      }
    };

    const ns = commentsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      commentButtonLoading: true,
    });
  });

  test('post to thread error action', () => {
    const action = {
      type: COMMENTS_POST_TO_THREAD_ERROR,
      payload: {
        detail: 'Invalid authentication token provided'
      }
    };

    const ns = commentsReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      commentButtonLoading: false,
      errors: true,
      message: action.payload.detail,
    });
  });
});