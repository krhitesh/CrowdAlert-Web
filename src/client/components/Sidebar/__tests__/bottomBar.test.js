import React from 'react';
import Enzyme, { shallow } from 'enzyme';
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
  },
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
    },
  };

  checkProps(BottomBar, expectedProps);
});

describe('renders with user logged in', () => {
  it('renders without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-bottombar')).toHaveLength(1);
  });

  it('renders grid map outline column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-grid-map-outline')).toHaveLength(1);
  });

  it('renders grid map camera column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-grid-map-camera')).toHaveLength(1);
  });

  it('renders notifications column without error', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-notifications')).toHaveLength(1);
  });

  describe('link test', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup({}, reduxPiece).dive();
    });

    it('link root', () => {
      expect(findByTestAttr(wrapper, 'link-root').props().to).toBe('/');
    });

    it('link create', () => {
      expect(findByTestAttr(wrapper, 'link-create').props().to).toBe('/create/');
    });

    it('link notifications', () => {
      expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
    });

    it('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login')).toHaveLength(0);
    });

    it('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup')).toHaveLength(0);
    });
  });
});

describe('renders when logged out', () => {
  // eslint-disable-next-line no-shadow
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
    it('renders without error', () => {
      expect(findByTestAttr(wrapper, 'component-bottombar')).toHaveLength(1);
    });

    it('does not renders logged in grid', () => {
      expect(findByTestAttr(wrapper, 'component-logged-in-grid')).toHaveLength(0);
    });

    it('renders logged out grid', () => {
      expect(findByTestAttr(wrapper, 'component-logged-out-grid')).toHaveLength(1);
    });

    it('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login')).toHaveLength(1);
    });

    it('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup')).toHaveLength(1);
    });

    it('link root', () => {
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login/');
    });

    it('link create', () => {
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup/');
    });
  });
});

test('does not render when invisible', () => {
  // eslint-disable-next-line no-shadow
  const reduxPiece = {
    auth: {
      isLoggedIn: false,
    },
    sidebar: {
      bottomBarIsVisible: false,
    },
  };

  const wrapper = setup({}, reduxPiece).dive();
  expect(findByTestAttr(wrapper, 'component-bottombar')).toHaveLength(0);
});

describe('redux props', () => {
  it('has redux piece of state', () => {
    const wrapper = setup({}, reduxPiece);
    const reduxProps = {
      auth: wrapper.props().auth,
      sidebar: {
        bottomBarIsVisible: wrapper.props().bottomBarIsVisible,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });
});
