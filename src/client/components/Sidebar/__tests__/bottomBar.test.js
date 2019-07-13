import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import BottomBar from '../bottomBar';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  sidebar: {
    bottomBarIsVisible: true,
  },
  auth: {
    isLoggedIn: true,
  }
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<BottomBar {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    bottomBarIsVisible: true,
    auth: {
      isLoggedIn: true,
    }
  };

  checkProps(BottomBar, expectedProps);
});

describe('renders with user logged in', () => {
  test('renders without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-bottombar').length).toBe(1);
  });

  test('renders grid map outline column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-grid-map-outline').length).toBe(1);
  });

  test('renders grid map camera column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-grid-map-camera').length).toBe(1);
  });

  test('renders notifications column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-notifications').length).toBe(1);
  });

  describe('link test', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup({}, reduxPiece).dive();
    });

    test('link root', () => {
      expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
    });

    test('link create', () => {
      expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create/');
    });

    test('link notifications', () => {
      expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
    });

    test('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login').length).toBe(0);
    });

    test('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup').length).toBe(0);
    });
  });

});

describe('renders when logged out', () => {
  const reduxPiece = {
    auth: {
      isLoggedIn: false,
    },
    sidebar: {
      bottomBarIsVisible: true,
    },
  };

  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  describe('does not render when logged out', () => {
    test('renders without error', () => {
      expect(findByTestAttr(wrapper, 'component-bottombar').length).toBe(1);
    });

    test('does not renders logged in grid', () => {
      expect(findByTestAttr(wrapper, 'component-logged-in-grid').length).toBe(0);
    });

    test('renders logged out grid', () => {
      expect(findByTestAttr(wrapper, 'component-logged-out-grid').length).toBe(1);
    });

    test('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login').length).toBe(1);
    });

    test('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup').length).toBe(1);
    });

    test('link root', () => {
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login/');
    });

    test('link create', () => {
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup/');
    });

  });
});

test('does not render when invisible', () => {
  const reduxPiece = {
    auth: {
      isLoggedIn: false,
    },
    sidebar: {
      bottomBarIsVisible: false,
    },
  };

  const wrapper = setup({}, reduxPiece).dive();
  expect(findByTestAttr(wrapper, 'component-bottombar').length).toBe(0);
});

describe('redux props', () => {
  test('has redux piece of state', () => {
    const wrapper = setup({}, reduxPiece);
    const reduxProps = {
      auth: wrapper.props().auth,
      sidebar: {
        bottomBarIsVisible: wrapper.props().bottomBarIsVisible
      }
    };

    expect(reduxProps).toEqual(reduxPiece);
  });
});
