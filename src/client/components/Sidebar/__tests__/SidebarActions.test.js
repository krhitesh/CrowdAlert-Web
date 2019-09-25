import {
  SIDEBAR_TOGGLE_VISIBILITY,
  SIDEBAR_SET_VISIBILITY,
  SIDEBAR_REMOVE_VISIBILITY,
  BOTTOMBAR_TOGGLE_VISIBILITY,
  BOTTTOMBAR_SET_VISIBILITY,
  BOTTTOMBAR_REMOVE_VISIBILITY,
} from '../actionTypes';
import {
  toggleSidebarVisibility,
  toggleVisibilityBottomBar,
  setBottomBarVisibility,
  setSidebarVisibility,
  removeSidebarVisibility,
  removeBottomBarVisibility
} from '../actions';

describe('testing sidebar actions', () => {
  test('removeBottomBarVisibility', () => {
    const action = removeBottomBarVisibility();
    expect(action).toEqual({
      type: BOTTTOMBAR_REMOVE_VISIBILITY,
    });
  });

  test('setBottomBarVisibility', () => {
    const action = setBottomBarVisibility();
    expect(action).toEqual({
      type: BOTTTOMBAR_SET_VISIBILITY,
    });
  });

  test('toggleVisibilityBottomBar', () => {
    const action = toggleVisibilityBottomBar();
    expect(action).toEqual({
      type: BOTTOMBAR_TOGGLE_VISIBILITY,
    });
  });

  test('toggleSidebarVisibility', () => {
    const payload = {
      animation: 'scale down'
    };
    const action = toggleSidebarVisibility(payload);
    expect(action).toEqual({
      type: SIDEBAR_TOGGLE_VISIBILITY,
      payload
    });
  });

  test('removeSidebarVisibility', () => {
    const payload = {
      animation: 'scale down'
    };
    const action = removeSidebarVisibility(payload);
    expect(action).toEqual({
      type: SIDEBAR_REMOVE_VISIBILITY,
      payload
    });
  });

  test('setSidebarVisibility', () => {
    const action = setSidebarVisibility();
    expect(action).toEqual({
      type: SIDEBAR_SET_VISIBILITY,
      payload: {}
    });
  });
});