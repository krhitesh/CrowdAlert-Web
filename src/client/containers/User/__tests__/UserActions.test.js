import {
  USER_UPDATE_USER_DATA,
  USER_UPDATE_USER_DATA_ERROR,
  USER_UPDATE_USER_DATA_SUCCESS,
} from '../actionTypes';
import {
  updateUserData,
  updateUserDataError,
  updateUserDataSuccess,
} from '../actions';

describe('testing user actions', () => {
  it('updateUserData', () => {
    const payload = { userData: { displayName: 'Fullname' } };
    const action = updateUserData(payload);
    expect(action).toEqual({
      type: USER_UPDATE_USER_DATA,
      payload,
    });
  });

  it('updateUserDataError', () => {
    const payload = new Error('testing "updateUserDataError" action');
    const action = updateUserDataError(payload);
    expect(action).toEqual({
      type: USER_UPDATE_USER_DATA_ERROR,
      payload,
    });
  });

  it('updateUserDataSuccess', () => {
    const payload = { status: 'ok' };
    const action = updateUserDataSuccess(payload);
    expect(action).toEqual({
      type: USER_UPDATE_USER_DATA_SUCCESS,
      payload,
    });
  });
});
