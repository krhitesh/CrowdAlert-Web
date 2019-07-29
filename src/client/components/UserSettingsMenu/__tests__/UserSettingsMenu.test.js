import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import UserSettingsMenu from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  open: false,
};

const reduxPiece = {
  auth: {
    user: {
      displayName: 'user display name',
      email: 'user@gmail.com',
      photoURL: '',
    },
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
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<UserSettingsMenu {...setupProps} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    signOut: jest.fn(),
    ...reduxPiece,
  };

  checkProps(UserSettingsMenu, expectedProps);
});

describe('renders', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-user-settings-menu')).toHaveLength(1);
  });

  it('renders user image', () => {
    expect(findByTestAttr(wrapper, 'component-image')).toHaveLength(1);
  });

  it('renders header content', () => {
    expect(findByTestAttr(wrapper, 'component-header-content')).toHaveLength(1);
  });

  describe('renders drop down items', () => {
    it('renders settings item', () => {
      expect(findByTestAttr(wrapper, 'item-settings')).toHaveLength(1);
    });

    it('renders user item', () => {
      expect(findByTestAttr(wrapper, 'item-user')).toHaveLength(1);
    });

    it('renders privacy item', () => {
      expect(findByTestAttr(wrapper, 'item-privacy')).toHaveLength(1);
    });

    it('renders tasks item', () => {
      expect(findByTestAttr(wrapper, 'item-tasks')).toHaveLength(1);
    });

    it('renders sign out item', () => {
      expect(findByTestAttr(wrapper, 'item-sign-out')).toHaveLength(1);
    });
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      auth: {
        user: wrapper.props().user,
        isLoggedIn: wrapper.props().isLoggedIn,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"signOut" action creator', () => {
    const signOutProps = wrapper.props().signOut;
    expect(signOutProps).toBeInstanceOf(Function);
  });
});

