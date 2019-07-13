import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import LeftSidebar from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  sidebar: {
    isVisible: true,
    animation: 'push'
  },
  auth: {
    isLoggedIn: true,
    user: {
      displayName: 'user display name',
      photoURL: 'https://assets2.razerzone.com/images/blade-15/shop/blade15-d1-1.jpg',
    }
  }
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
      photoURL: 'url'
    }
  };

  checkProps(LeftSidebar, expectedProps);
});

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-left-sidebar').length).toBe(1);
  });

  test('renders logo', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-logo-image').length).toBe(1);
  });

  test('renders link', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-root').length).toBe(1);
  });

  test('render link create', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-create').length).toBe(1);
  });

  test('link root prop', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
  })

  test('link create prop', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create');
  });

  test('render sidebar pusher', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'sidebar-pusher').length).toBe(1);
  });

  test('component menu item', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-menu-item').length).toBe(1);
  });

  test('component menu item signout', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-menu-item-signout').length).toBe(1);
  });

  test('logged out menu', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'jsx-logged-out').length).toBe(0);
  });

  describe('renders with user logged out', () => {
    const reduxPiece = {
      sidebar: {
        isVisible: true,
        animation: 'push'
      },
      auth: {
        isLoggedIn: false,
        user: {
          displayName: 'user display name',
          photoURL: 'https://assets2.razerzone.com/images/blade-15/shop/blade15-d1-1.jpg',
        }
      }
    }
    test('component menu item', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-menu-item').length).toBe(0);
    });
  
    test('component menu item signout', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-menu-item-signout').length).toBe(0);
    });

    test('logged out menu', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'jsx-logged-out').length).toBe(1);
    });

    test('renders link login', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login').length).toBe(1);
    });
  
    test('render link signup', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup').length).toBe(1);
    });

    test('link login prop', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login');
    })
  
    test('link signup prop', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
    });

    test('renders link login content', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-login-content').length).toBe(1);
    });
  
    test('render link signup content', () => {
      const wrapper = setup({ children: <React.Fragment /> }, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'link-signup-content').length).toBe(1);
    });

  });
});

describe('redux props', () => {
  test('redux piece of state', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const { isVisible, animation } = wrapper.props();
    const reduxProps = {
      auth: {
        user: wrapper.props().user,
        isLoggedIn: wrapper.props().isLoggedIn
      },
      sidebar: {
        isVisible,
        animation
      }
    }

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"signOut" action creator', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const signOutProps = wrapper.props().signOut;
    expect(signOutProps).toBeInstanceOf(Function);
  });

  test(' action creator', () => {
    const wrapper = setup({ children: <React.Fragment /> }, reduxPiece);
    const removeSidebarVisibilityProps = wrapper.props().removeSidebarVisibility;
    expect(removeSidebarVisibilityProps).toBeInstanceOf(Function);
  });
});