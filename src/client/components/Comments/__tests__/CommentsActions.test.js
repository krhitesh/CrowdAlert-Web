import {
  WS_NEW_COMMENT_RECEIVED,
  COMMENTS_FETCH_THREAD,
  COMMENTS_FETCH_THREAD_SUCCESS,
  COMMENTS_FETCH_THREAD_CANCEL,
  COMMENTS_FETCH_THREAD_ERROR,
  COMMENTS_POST_TO_THREAD,
  COMMENTS_POST_TO_THREAD_SUCCESS,
  COMMENTS_POST_TO_THREAD_CANCEL,
  COMMENTS_POST_TO_THREAD_ERROR,
} from '../actionTypes';
import {
  fetchCommentThreadSuccessViaWebSocket,
  fetchCommentsThread,
  fetchCommentsThreadCancel,
  fetchCommentsThreadSuccess,
  fetchCommnetsThreadError,
  postCommentToThread,
  postCommentToThreadError,
  postCommentToThreadSuccess,
  postCommnetToThreadCancel
} from '../actions';

describe('testing comments actions', () => {
  test("fetchCommentsThread", () => {
    const payload = {
      threadId: '',
      showLoader: true
    };
    const action = fetchCommentsThread(payload.threadId, payload.showLoader);
    expect(action).toEqual({
      type: COMMENTS_FETCH_THREAD,
      payload,
      meta: {
        ajax: true
      }
    });
  });

  test("fetchCommentThreadSuccessViaWebSocket", () => {
    const payload = {
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
    };
    const action = fetchCommentThreadSuccessViaWebSocket(payload);
    expect(action).toEqual({
      type: WS_NEW_COMMENT_RECEIVED,
      payload
    });
  });

  test("fetchCommentsThreadSuccess", () => {
    const payload = {
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
    };
    const action = fetchCommentsThreadSuccess(payload);
    expect(action).toEqual({
      type: COMMENTS_FETCH_THREAD_SUCCESS,
      payload
    });
  });

  test("fetchCommnetsThreadError", () => {
    const payload = new Error('testing "fetchCommnetsThreadError" action');
    const action = fetchCommnetsThreadError(payload);
    expect(action).toEqual({
      type: COMMENTS_FETCH_THREAD_ERROR,
      payload
    });
  });

  test("fetchCommentsThreadCancel", () => {
    const action = fetchCommentsThreadCancel();
    expect(action).toEqual({
      type: COMMENTS_FETCH_THREAD_CANCEL,
    });
  });

  test("postCommentToThread", () => {
    const payload = {
      comment: 'comment',
      threadId: 'threadId'
    };
    const action = postCommentToThread(payload.comment, payload.threadId);
    expect(action).toEqual({
      type: COMMENTS_POST_TO_THREAD,
      payload,
      meta: {
        ajax: true
      }
    });
  });

  test("postCommentToThreadSuccess", () => {
    const payload = {
      originalEvent: {
        isTrusted: true
      },
      xhr: {},
      request: {
        async: true,
        crossDomain: true,
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          token: 'Q'
        },
        method: 'POST',
        responseType: 'json',
        timeout: 0,
        url: 'https://crowdalert.herokuapp.com/api/comments/comment',
        body: '{"commentData":"{\\"text\\":\\"asd\\",\\"thread\\":\\"cL1z6l9TQ7FpK6ypgLwF\\"}"}'
      },
      status: 200,
      responseType: 'json',
      response: {
        id: 'C9Pq6b2R5ZEAh6JYo0vw'
      }
    };
    const action = postCommentToThreadSuccess(payload);
    expect(action).toEqual({
      type: COMMENTS_POST_TO_THREAD_SUCCESS,
      payload
    });
  });

  test("postCommentToThreadError", () => {
    const payload = {
      detail: 'Invalid authentication token provided'
    };
    const action = postCommentToThreadError(payload);
    expect(action).toEqual({
      type: COMMENTS_POST_TO_THREAD_ERROR,
      payload
    });
  });

  test("postCommnetToThreadCancel", () => {
    const action = postCommnetToThreadCancel();
    expect(action).toEqual({
      type: COMMENTS_POST_TO_THREAD_CANCEL,
    });
  });
});