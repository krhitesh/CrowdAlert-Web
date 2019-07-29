import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import LoginForm from '../Loginform';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  static: false,
  size: 'huge',
  circular: true,
  fetchOnLoad: false,
  floated: 'right',
};

const reduxPiece = {
  auth: {
    loginForm: {
      errors: false,
      message: null,
      loading: true,
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
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<LoginForm {...setupProps} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    submitEmailPasswordAuthentication: jest.fn(),
    loginForm: {
      errors: false,
      message: null,
      loading: true,
    },
  };

  checkProps(LoginForm, expectedProps);
});

describe('render', () => {
  it('renders without errors', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-login-form')).toHaveLength(1);
  });

  it('does not render errors', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'login-errors')).toHaveLength(0);
  });

  it('renders email field without errors', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'form-email')).toHaveLength(1);
  });

  it('renders  password field without errors', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'form-password')).toHaveLength(1);
  });

  it('renders button without errors', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'form-btn-login')).toHaveLength(1);
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
        loginForm: wrapper.props().loginForm,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"submitEmailPasswordAuthentication" action creator', () => {
    const submitEmailPasswordAuthenticationProps = wrapper.props()
      .submitEmailPasswordAuthentication;
    expect(submitEmailPasswordAuthenticationProps).toBeInstanceOf(Function);
  });
});
