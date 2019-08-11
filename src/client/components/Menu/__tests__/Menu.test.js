import React from 'react';
import Enzyme, { shallow } from 'enzyme';
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

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-menu')).toHaveLength(1);
  });

  it('renders responsive mobile view', () => {
    expect(findByTestAttr(wrapper, 'resp-only-mobile')).toHaveLength(1);
  });

  it('renders left menu', () => {
    expect(findByTestAttr(wrapper, 'left-menu')).toHaveLength(1);
  });

  it('renders responsive menu', () => {
    expect(findByTestAttr(wrapper, 'resp-menu')).toHaveLength(1);
  });

  it('renders image logo', () => {
    expect(findByTestAttr(wrapper, 'component-image-logo')).toHaveLength(1);
  });

  it('link root', () => {
    expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
  });

  it('lint create', () => {
    expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create');
  });

  it('link login 0', () => {
    expect(findByTestAttr(wrapper, 'link-login').at(0).props().to).toBe('/login');
  });

  it('link signup', () => {
    expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
  });

  it('link notifications', () => {
    expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
  });

  it('renders link notification', () => {
    expect(findByTestAttr(wrapper, 'component-link-notifications')).toHaveLength(1);
  });

  it('renders signup link', () => {
    expect(findByTestAttr(wrapper, 'component-link-signup')).toHaveLength(1);
  });

  it('renders create link', () => {
    expect(findByTestAttr(wrapper, 'component-link-create')).toHaveLength(1);
  });

  it('renders root link', () => {
    expect(findByTestAttr(wrapper, 'component-link-root')).toHaveLength(1);
  });
});

describe('renders with login', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { auth: { isLoggedIn: true } }).dive();
  });

  it('renders user settins menu', () => {
    expect(findByTestAttr(wrapper, 'component-user-settings-menu')).toHaveLength(1);
  });
});

describe('redux props', () => {
  const reduxPiece = {
    auth: {
      isLoggedIn: true,
    },
  };
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      auth: {
        isLoggedIn: wrapper.props().isLoggedIn,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"toggleSidebarVisibility" action creator', () => {
    const toggleSidebarVisibilityProp = wrapper.props().toggleSidebarVisibility;
    expect(toggleSidebarVisibilityProp).toBeInstanceOf(Function);
  });
});
