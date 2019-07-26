import {
  SIDEBAR_TOGGLE_VISIBILITY,
  SIDEBAR_SET_VISIBILITY,
  SIDEBAR_REMOVE_VISIBILITY,
  BOTTOMBAR_TOGGLE_VISIBILITY,
  BOTTTOMBAR_SET_VISIBILITY,
  BOTTTOMBAR_REMOVE_VISIBILITY,
} from '../actionTypes';
import sidebarReducer from '../reducers';

const initialState = {
  isVisible: false,
  bottomBarIsVisible: true,
  bottomBarWasVisible: true,
  animation: 'uncover',
};

describe('testing sidebar reducer', () => {
  test('no change when no action is passed', () => {
    const ns = sidebarReducer(initialState, {});
    expect(ns).toEqual(initialState);
  });

  test('toggle visibility action', () => {
    const action = {
      type: SIDEBAR_TOGGLE_VISIBILITY,
      payload: {
        animation: 'scale down'
      }
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      isVisible: true,
      bottomBarIsVisible: !initialState.isVisible ? false : initialState.bottomBarWasVisible,
      bottomBarWasVisible: initialState.bottomBarIsVisible,
      animation: action.payload.animation || initialState.animation,
    });
  });

  test('set visibility action', () => {
    const action = {
      type: SIDEBAR_SET_VISIBILITY,
      payload: {}
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      isVisible: true,
      animation: action.payload.animation || initialState.animation,
      bottomBarIsVisible: !initialState.isVisible ? false : initialState.bottomBarWasVisible,
      bottomBarWasVisible: initialState.bottomBarIsVisible,
    });
  });

  test('remove visibility action', () => {
    const action = {
      type: SIDEBAR_REMOVE_VISIBILITY,
      payload: {
        animation: 'scale down'
      }
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      isVisible: false,
      bottomBarIsVisible: !initialState.isVisible ? false : initialState.bottomBarWasVisible,
      bottomBarWasVisible: initialState.bottomBarIsVisible,
    });
  });

  test('bottom bar toggle visibility action', () => {
    const action = {
      type: BOTTOMBAR_TOGGLE_VISIBILITY,
      payload: {}
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      bottomBarIsVisible: !initialState.bottomBarIsVisible,
    });
  });

  test('bottom bar set visibility action', () => {
    const action = {
      type: BOTTTOMBAR_SET_VISIBILITY,
      payload: {}
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      bottomBarIsVisible: true,
      bottomBarWasVisible: initialState.bottomBarIsVisible,
    });
  });

  test('bottom bar remove visibility action', () => {
    const action = {
      type: BOTTTOMBAR_REMOVE_VISIBILITY,
      payload: {}
    };

    const ns = sidebarReducer(initialState, action);
    expect(ns).toEqual({
      ...initialState,
      bottomBarIsVisible: false,
      bottomBarWasVisible: initialState.bottomBarIsVisible,
    });
  });
});