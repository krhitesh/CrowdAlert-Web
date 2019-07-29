import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import LoginPage from '../LoginPage';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
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
  const wrapper = shallow(<LoginPage.component {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    isLoggedIn: false,
    removeBottomBarVisibility: jest.fn(),
    setBottomBarVisibility: jest.fn(),
  };

  checkProps(LoginPage.component, expectedProps);
});

describe('renders', () => {
  it('redirects to root', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'redirect-root')).toHaveLength(1);
  });

  const rp = {
    auth: {
      isLoggedIn: false,
    },
  };

  it('renders login page component without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'component-login-page')).toHaveLength(1);
  });

  it('renders login form component without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'component-login-form')).toHaveLength(1);
  });

  it('renders oauth component without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'component-oauth')).toHaveLength(1);
  });

  it('renders responsivev login form component without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'res-login-form')).toHaveLength(1);
  });

  it('renders signup link without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'link-signup')).toHaveLength(1);
  });

  it('renders responsive oauth component without errors', () => {
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'res-component-oauth')).toHaveLength(1);
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
        isLoggedIn: wrapper.props().isLoggedIn,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"removeBottomBarVisibility" action creator', () => {
    const removeBottomBarVisibilityProps = wrapper.props().removeBottomBarVisibility;
    expect(removeBottomBarVisibilityProps).toBeInstanceOf(Function);
  });

  it('"setBottomBarVisibility" action creator', () => {
    const setBottomBarVisibilityProps = wrapper.props().setBottomBarVisibility;
    expect(setBottomBarVisibilityProps).toBeInstanceOf(Function);
  });
});
