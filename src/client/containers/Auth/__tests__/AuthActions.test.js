import {
  AUTH_LOGIN_SUBMIT_EMAIL_PASSWORD,
  AUTH_LOGIN_SUCCESS_EMAIL_PASSWORD,
  AUTH_LOGIN_ERROR_EMAIL_PASSWORD,
  AUTH_SIGNUP_EMAIL_PASSWORD,
  AUTH_SIGNUP_EMAIL_PASSWORD_ERROR,
  AUTH_SIGNUP_EMAIL_PASSWORD_SUCCESS,
  AUTH_CHECK_USER_STATUS,
  AUTH_LOGOUT_SUBMIT,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_ERROR,
  AUTH_UPDATE_USER_DATA,
  AUTH_SEND_VERIFICATION_EMAIL,
  AUTH_SEND_VERIFICATION_EMAIL_SUCCESS,
  AUTH_SEND_VERIFICATION_EMAIL_ERROR,
  AUTH_VERIFY_EMAIL_LINK,
  AUTH_VERIFY_EMAIL_LINK_ERROR,
  AUTH_VERIFY_EMAIL_LINK_SUCCESS,
  AUTH_OAUTH_SIGNIN,
  AUTH_OAUTH_SIGNIN_ERROR,
  AUTH_OAUTH_SIGNIN_SUCCESS,
} from '../actionTypes';
import {
  submitEmailPasswordAuthentication,
  successEmailPasswordAuthentication,
  errorEmailPasswordAuthentication,
  checkUserAuthenticationStatus,
  logoutUserAuthencation,
  logoutUserSuccess,
  logoutUserError,
  updateUserAuthenticationData,
  signUpEmailPassword,
  signUpEmailPasswordError,
  signUpEmailPasswordSuccess,
  verifyEmailAuth,
  verifyEmailAuthError,
  verifyEmailAuthSuccess,
  sendEmailVerificationAuth,
  sendEmailVerificationAuthError,
  sendEmailVerificationAuthSuccess,
  signInOAuth,
  signInOAuthError,
  signInOAuthSuccess
} from '../actions';


describe('testing auth actions', () => {
  test("submitEmailPasswordAuthentication", () => {
    const payload = {
      email: 'email',
      password: 'password'
    }
    const action = submitEmailPasswordAuthentication(payload.email, payload.password);
    expect(action).toEqual({
      type: AUTH_LOGIN_SUBMIT_EMAIL_PASSWORD,
      payload
    });
  });

  test("successEmailPasswordAuthentication", () => {
    const action = successEmailPasswordAuthentication();
    expect(action).toEqual({
      type: AUTH_LOGIN_SUCCESS_EMAIL_PASSWORD,
    });
  });

  test("errorEmailPasswordAuthentication", () => {
    const payload = {
      error: new Error('testing "errorEmailPasswordAuthentication" action')
    };
    const action = errorEmailPasswordAuthentication(payload);
    expect(action).toEqual({
      type: AUTH_LOGIN_ERROR_EMAIL_PASSWORD,
      payload
    });
  });

  test("checkUserAuthenticationStatus", () => {
    const action = checkUserAuthenticationStatus();
    expect(action).toEqual({
      type: AUTH_CHECK_USER_STATUS,
    });
  });

  test("logoutUserAuthencation", () => {
    const action = logoutUserAuthencation();
    expect(action).toEqual({
      type: AUTH_LOGOUT_SUBMIT,
    });
  });

  test("logoutUserSuccess", () => {
    const action = logoutUserSuccess();
    expect(action).toEqual({
      type: AUTH_LOGOUT_SUCCESS,
    });
  });

  test("logoutUserError", () => {
    const action = logoutUserError();
    expect(action).toEqual({
      type: AUTH_LOGOUT_ERROR,
    });
  });

  test("updateUserAuthenticationData", () => {
    const payload = {
      loggedIn: true,
      user: {}
    };
    const action = updateUserAuthenticationData(payload);
    expect(action).toEqual({
      type: AUTH_UPDATE_USER_DATA,
      payload
    });
  });

  test("sendEmailVerificationAuth", () => {
    const payload = {
      email: 'email'
    }
    const action = sendEmailVerificationAuth(payload.email);
    expect(action).toEqual({
      type: AUTH_SEND_VERIFICATION_EMAIL,
      payload
    });
  });

  test("sendEmailVerificationAuthSuccess", () => {
    const action = sendEmailVerificationAuthSuccess();
    expect(action).toEqual({
      type: AUTH_SEND_VERIFICATION_EMAIL_SUCCESS,
    });
  });

  test("sendEmailVerificationAuthError", () => {
    const payload = {
      message: 'error'
    };
    const action = sendEmailVerificationAuthError(payload.message);
    expect(action).toEqual({
      type: AUTH_SEND_VERIFICATION_EMAIL_ERROR,
      payload
    });
  });

  test("verifyEmailAuth", () => {
    const payload = {
      email: 'email'
    };
    const action = verifyEmailAuth(payload.email);
    expect(action).toEqual({
      type: AUTH_VERIFY_EMAIL_LINK,
      payload
    });
  });

  test("verifyEmailAuthSuccess", () => {
    const action = verifyEmailAuthSuccess();
    expect(action).toEqual({
      type: AUTH_VERIFY_EMAIL_LINK_SUCCESS,
    });
  });

  test("verifyEmailAuthError", () => {
    const payload = {
      message: 'error'
    };
    const action = verifyEmailAuthError(payload.message);
    expect(action).toEqual({
      type: AUTH_VERIFY_EMAIL_LINK_ERROR,
      payload
    });
  });

  test("signInOAuth", () => {
    const payload = {
      provider: 'Facebook'
    };
    const action = signInOAuth(payload.provider);
    expect(action).toEqual({
      type: AUTH_OAUTH_SIGNIN,
      payload
    });
  });

  test("signInOAuthError", () => {
    const payload = {
      message: 'error'
    };
    const action = signInOAuthError(payload.message);
    expect(action).toEqual({
      type: AUTH_OAUTH_SIGNIN_ERROR,
      payload
    });
  });

  test("signInOAuthSuccess", () => {
    const action = signInOAuthSuccess();
    expect(action).toEqual({
      type: AUTH_OAUTH_SIGNIN_SUCCESS,
    });
  });

  test("signUpEmailPassword", () => {
    const payload = {
      email: 'email',
      fullname: 'fullname',
      password: 'password'
    };
    const action = signUpEmailPassword(payload.email, payload.fullname, payload.password);
    expect(action).toEqual({
      type: AUTH_SIGNUP_EMAIL_PASSWORD,
      payload
    });
  });

  test("signUpEmailPasswordSuccess", () => {
    const payload = {
      fullname: 'fullname'
    }
    const action = signUpEmailPasswordSuccess(payload.fullname);
    expect(action).toEqual({
      type: AUTH_SIGNUP_EMAIL_PASSWORD_SUCCESS,
      payload
    });
  });

  test("signUpEmailPasswordError", () => {
    const payload = {
      message: 'error'
    };
    const action = signUpEmailPasswordError(payload.message);
    expect(action).toEqual({
      type: AUTH_SIGNUP_EMAIL_PASSWORD_ERROR,
      payload
    });
  });
});