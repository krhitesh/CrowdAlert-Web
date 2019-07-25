import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import SignUpForm from '../SignUpform';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
      signupForm: {
          loading: false,
          message: null,
          errors: false
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
  const wrapper = shallow(<SignUpForm {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
    const expectedProps = {
        signUpEmailPassword: jest.fn(),
        signupForm: {
            ...reduxPiece.auth.signupForm
        }
    };

    checkProps(SignUpForm, expectedProps);
});

describe('renders', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece).dive();
    });

    test('renders without errors', () => {
        expect(findByTestAttr(wrapper, 'component-signupform').length).toBe(1);
    });

    test('renders form without errors', () => {
        expect(findByTestAttr(wrapper, 'signup-form').length).toBe(1);
    });

    test('does not render errors without errors', () => {
        expect(findByTestAttr(wrapper, 'errors').length).toBe(0);
    });

    test('renders fullname input without errors', () => {
        expect(findByTestAttr(wrapper, 'input-fullname').length).toBe(1);
    });

    test('renders email input without errors', () => {
        expect(findByTestAttr(wrapper, 'input-email').length).toBe(1);
    });

    test('renders password input without errors', () => {
        expect(findByTestAttr(wrapper, 'input-password').length).toBe(1);
    });

    test('renders submit button without errors', () => {
        expect(findByTestAttr(wrapper, 'btn-submit').length).toBe(1);
    });

    test('renders errors without errors', () => {
        let rp = reduxPiece;
        rp.auth.signupForm.errors = true;
        rp.auth.signupForm.message = 'error message';
        const wrapper = setup({}, rp).dive();
        expect(findByTestAttr(wrapper, 'errors').length).toBe(1);
    });
});

describe('redux props', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece);
    });

    test('has redux piece of state', () => {
        const reduxProps = {
            auth: {
                signupForm: wrapper.props().signupForm
            }
        };

        expect(reduxProps).toEqual(reduxPiece);
    });

    test('"signUpEmailPassword" action creator', () => {
        const signUpEmailPasswordProps = wrapper.props().signUpEmailPassword;
        expect(signUpEmailPasswordProps).toBeInstanceOf(Function);
    });
});