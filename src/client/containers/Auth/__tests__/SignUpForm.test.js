import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import SignUpForm from '../SignUpform';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    signupForm: {
      loading: false,
      message: null,
      errors: false,
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
  const wrapper = shallow(<SignUpForm {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    signUpEmailPassword: jest.fn(),
    signupForm: {
      ...reduxPiece.auth.signupForm,
    },
  };

  checkProps(SignUpForm, expectedProps);
});

describe('renders', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  it('renders without errors', () => {
    expect(findByTestAttr(wrapper, 'component-signupform')).toHaveLength(1);
  });

  it('renders form without errors', () => {
    expect(findByTestAttr(wrapper, 'signup-form')).toHaveLength(1);
  });

  it('does not render errors without errors', () => {
    expect(findByTestAttr(wrapper, 'errors')).toHaveLength(0);
  });

  it('renders fullname input without errors', () => {
    expect(findByTestAttr(wrapper, 'input-fullname')).toHaveLength(1);
  });

  it('renders email input without errors', () => {
    expect(findByTestAttr(wrapper, 'input-email')).toHaveLength(1);
  });

  it('renders password input without errors', () => {
    expect(findByTestAttr(wrapper, 'input-password')).toHaveLength(1);
  });

  it('renders submit button without errors', () => {
    expect(findByTestAttr(wrapper, 'btn-submit')).toHaveLength(1);
  });

  it('renders errors without errors', () => {
    const rp = reduxPiece;
    rp.auth.signupForm.errors = true;
    rp.auth.signupForm.message = 'error message';
    // eslint-disable-next-line no-shadow
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'errors')).toHaveLength(1);
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
        signupForm: wrapper.props().signupForm,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"signUpEmailPassword" action creator', () => {
    const signUpEmailPasswordProps = wrapper.props().signUpEmailPassword;
    expect(signUpEmailPasswordProps).toBeInstanceOf(Function);
  });
});
