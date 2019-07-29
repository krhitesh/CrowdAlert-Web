import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import LeftSidebar from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  sidebar: {
    isVisible: true,
    animation: 'push',
  },
  auth: {
    isLoggedIn: true,
    user: {
      displayName: 'user display name',
      photoURL: 'https://assets2.razerzone.com/images/blade-15/shop/blade15-d1-1.jpg',
    },
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<LeftSidebar {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    removeSidebarVisibility: jest.fn(),
    isVisible: true,
    animation: 'push',
    children: <React.Fragment />,
    isLoggedIn: true,
    signOut: jest.fn(),
    user: {
      displayName: 'user display name',
      photoURL: 'url',
    },
  };

  checkProps(LeftSidebar, expectedProps);
});

describe('render', () => {
  it('renders without error', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-left-sidebar')).toHaveLength(1);
  });

  it('renders logo', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-logo-image')).toHaveLength(1);
  });

  it('renders link', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-root')).toHaveLength(1);
  });

  it('render link create', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-create')).toHaveLength(1);
  });

  it('link root prop', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
  });

  it('link create prop', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create');
  });

  it('render sidebar pusher', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'sidebar-pusher')).toHaveLength(1);
  });

  it('component menu item', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-menu-item')).toHaveLength(1);
  });

  it('component menu item signout', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-menu-item-signout')).toHaveLength(1);
  });

  it('logged out menu', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'jsx-logged-out')).toHaveLength(0);
  });

  describe('renders with user logged out', () => {
    // eslint-disable-next-line no-shadow
    const reduxPiece = {
      sidebar: {
        isVisible: true,
        animation: 'push',
      },
      auth: {
        isLoggedIn: false,
        user: {
          displayName: 'user display name',
          photoURL: 'https://assets2.razerzone.com/images/blade-15/shop/blade15-d1-1.jpg',
        },
      },
    };
    it('component menu item', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-menu-item')).toHaveLength(0);
    });

    it('component menu item signout', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-menu-item-signout')).toHaveLength(0);
    });

    it('logged out menu', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'jsx-logged-out')).toHaveLength(1);
    });

    it('renders link login', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login')).toHaveLength(1);
    });

    it('render link signup', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup')).toHaveLength(1);
    });

    it('link login prop', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login');
    });

    it('link signup prop', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
    });

    it('renders link login content', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login-content')).toHaveLength(1);
    });

    it('render link signup content', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup-content')).toHaveLength(1);
    });
  });
});

describe('redux props', () => {
  it('redux piece of state', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const { isVisible, animation } = wrapper.props();
    const reduxProps = {
      auth: {
        user: wrapper.props().user,
        isLoggedIn: wrapper.props().isLoggedIn,
      },
      sidebar: {
        isVisible,
        animation,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"signOut" action creator', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const signOutProps = wrapper.props().signOut;
    expect(signOutProps).toBeInstanceOf(Function);
  });

  it(' action creator', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const removeSidebarVisibilityProps = wrapper.props().removeSidebarVisibility;
    expect(removeSidebarVisibilityProps).toBeInstanceOf(Function);
  });
});
