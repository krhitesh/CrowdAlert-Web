import {
  AUTH_UPDATE_USER_DATA,
  AUTH_LOGIN_SUBMIT_EMAIL_PASSWORD,
  AUTH_LOGIN_SUCCESS_EMAIL_PASSWORD,
  AUTH_LOGIN_ERROR_EMAIL_PASSWORD,
  AUTH_CHECK_USER_STATUS,
  AUTH_SIGNUP_EMAIL_PASSWORD,
  AUTH_SIGNUP_EMAIL_PASSWORD_ERROR,
  AUTH_SIGNUP_EMAIL_PASSWORD_SUCCESS,
} from '../actionTypes';
import authenticationReducer from '../reducers';

const initialState = {
  isLoggedIn: false,
  user: {},
  authenticating: false,
  loginForm: {
    errors: false,
    message: '',
    loading: false,
  },
  signupForm: {
    errors: false,
    message: '',
    loading: false,
  },
  confirmEmailForm: {
    email: false,
    isVerified: false,
    isVerifying: false,
    errors: false,
    message: '',
  },
};

describe('testing authentication reducer', () => {
  test('no change when no action is passed', () => {
    const ns = authenticationReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('update user data action', () => {
    const action = {
      type: AUTH_UPDATE_USER_DATA,
      payload: {
        loggedIn: true,
        user: {}
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      isLoggedIn: action.payload.loggedIn,
      authenticating: false,
      user: {
        ...action.payload.user,
      },
      loginForm: {
        ...initialState.loginForm,
        loading: false,
      },
    });
  });

  test('submit email password action', () => {
    const action = {
      type: AUTH_LOGIN_SUBMIT_EMAIL_PASSWORD,
      payload: {
        email: 'email',
        password: 'password'
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      loginForm: {
        ...initialState.loginForm,
        loading: true,
        errors: false,
      }
    });
  });

  test('success email password action', () => {
    const action = {
      type: AUTH_LOGIN_SUCCESS_EMAIL_PASSWORD,
      payload: {}
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      loginForm: {
        ...initialState.loginForm,
        loading: false,
      }
    });
  });

  test('error email password action', () => {
    const action = {
      type: AUTH_LOGIN_ERROR_EMAIL_PASSWORD,
      payload: {
        error: new Error('testing "errorEmailPasswordAuthentication" action')
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      loginForm: {
        ...initialState.loginForm,
        loading: false,
        errors: true,
        message: action.payload,
      },
    });
  });

  test('check user status action', () => {
    const action = {
      type: AUTH_CHECK_USER_STATUS,
      payload: {}
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      authenticating: true,
    });
  });

  test('signup email password action', () => {
    const action = {
      type: AUTH_SIGNUP_EMAIL_PASSWORD,
      payload: {
        email: 'email',
        fullname: 'fullname',
        password: 'password'
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      signupForm: {
        ...initialState.signupForm,
        loading: true,
        errors: false,
      },
    });
  });

  test('signup email password error action', () => {
    const action = {
      type: AUTH_SIGNUP_EMAIL_PASSWORD_ERROR,
      payload: {
        message: 'error'
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      signupForm: {
        ...initialState.signupForm,
        loading: false,
        errors: true,
        message: action.payload.message,
      },
    });
  });

  test('signup email password success action', () => {
    const action = {
      type: AUTH_SIGNUP_EMAIL_PASSWORD_SUCCESS,
      payload: {
        fullname: 'fullname'
      }
    };

    const ns = authenticationReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      signupForm: {
        ...initialState.signupForm,
        loading: false,
      },
    });
  });
  
});