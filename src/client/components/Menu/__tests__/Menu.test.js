import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Menu from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<Menu {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    isLoggedIn: false,
    toggleSidebarVisibility: jest.fn(),
  };

  checkProps(Menu, expectedProps);
});

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { auth: { isLoggedIn: false } }).dive();
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-menu').length).toBe(1);
  });

  test('renders responsive mobile view', () => {
    expect(findByTestAttr(wrapper, 'resp-only-mobile').length).toBe(1);
  });

  test('renders responsive tab view', () => {
    expect(findByTestAttr(wrapper, 'resp-only-tabs').length).toBe(1);
  });

  test('renders left menu', () => {
    expect(findByTestAttr(wrapper, 'left-menu').length).toBe(1);
  });

  test('renders responsive menu', () => {
    expect(findByTestAttr(wrapper, 'resp-menu').length).toBe(1);
  });

  test('renders image logo', () => {
    expect(findByTestAttr(wrapper, 'component-image-logo').length).toBe(1);
  });

  test('link root', () => {
    expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
  });

  test('lint create', () => {
    expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create');
  });

  test('link login 0', () => {
    expect(findByTestAttr(wrapper, 'link-login').at(0).props().to).toBe('/login');
  });

  test('link login 1', () => {
    expect(findByTestAttr(wrapper, 'link-login').at(1).props().to).toBe('/login');
  });

  test('link signup', () => {
    expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
  });

  test('link notifications', () => {
    expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
  });

  test('renders link notification', () => {
    expect(findByTestAttr(wrapper, 'component-link-notifications').length).toBe(1);
  });

  test('renders signup link', () => {
    expect(findByTestAttr(wrapper, 'component-link-signup').length).toBe(1);
  });

  test('renders login link', () => {
    expect(findByTestAttr(wrapper, 'component-link-login').length).toBe(2);
  });

  test('renders create link', () => {
    expect(findByTestAttr(wrapper, 'component-link-create').length).toBe(1);
  });

  test('renders root link', () => {
    expect(findByTestAttr(wrapper, 'component-link-root').length).toBe(1);
  });
});

describe('renders with login', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { auth: { isLoggedIn: true } }).dive();
  });

  test('renders notifications dropdown', () => {
    expect(findByTestAttr(wrapper, 'component-notifications-dropdown').length).toBe(2);
  });

  test('renders user settins menu', () => {
    expect(findByTestAttr(wrapper, 'component-user-settings-menu').length).toBe(1);
  })
});

describe('redux props', () => {
  const reduxPiece = {
    auth: {
      isLoggedIn: true,
    }
  };
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  test('has redux piece of state', () => {
    const reduxProps = {
      auth: {
        isLoggedIn: wrapper.props().isLoggedIn
      }
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"toggleSidebarVisibility" action creator', () => {
    const toggleSidebarVisibilityProp = wrapper.props().toggleSidebarVisibility;
    expect(toggleSidebarVisibilityProp).toBeInstanceOf(Function);
  });

});
