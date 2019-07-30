/* eslint-disable no-tabs */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {
  findByTestAttr,
  storeFactory,
  checkProps,
} from '../../../tests/testUtils';
import ConfirmEmail from '../confirmEmail';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    user: {
      displayName: 'user display name',
      photoURL: '',
    },
    confirmEmailForm: {
      email: true,
      isVerified: true,
      isVerifying: false,
      message: null,
      errors: false,
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
  const wrapper = shallow(<ConfirmEmail.component {...props} store={store} />).dive();
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...reduxPiece,
    verifyEmailAuth: jest.fn(),
    sendEmailVerificationAuth: jest.fn(),
  };

  checkProps(ConfirmEmail.component, expectedProps);
});

describe('render', () => {
  it('renders without error', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'component-confirm-email')).toHaveLength(1);
  });

  it('renders no errors', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'confirm-email-errors')).toHaveLength(0);
  });

  it('renders verified', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'verified')).toHaveLength(1);
  });

  it('renders email sent', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'email-sent')).toHaveLength(1);
  });

  it('renders email prompt', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'email-prompt')).toHaveLength(0);
  });

  it('renders no verifying', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'verifying')).toHaveLength(0);
  });

  it('renders link to feed in confirmEmail', () => {
    const	wrapper = setup({}, reduxPiece).dive().dive();
    expect(findByTestAttr(wrapper, 'link-to-feed')).toHaveLength(1);
  });

  it('renders error component', () => {
    const rp = {
      auth: {
        ...reduxPiece.auth,
        confirmEmailForm: {
          email: true,
          isVerified: true,
          isVerifying: false,
          message: 'error message',
          errors: true,
        },
      },
    };
    const	wrapper = setup({}, rp).dive().dive();
    expect(findByTestAttr(wrapper, 'confirm-email-errors')).toHaveLength(1);
  });

  it('renders verifying', () => {
    const rp = {
      auth: {
        ...reduxPiece.auth,
        confirmEmailForm: {
          email: true,
          isVerified: false,
          isVerifying: true,
          message: null,
          errors: false,
        },
      },
    };
    const	wrapper = setup({}, rp).dive().dive();
    expect(findByTestAttr(wrapper, 'verifying')).toHaveLength(1);
  });

  it('renders no verified', () => {
    const rp = {
      auth: {
        ...reduxPiece.auth,
        confirmEmailForm: {
          email: true,
          isVerified: false,
          isVerifying: true,
          message: null,
          errors: false,
        },
      },
    };
    const	wrapper = setup({}, rp).dive().dive();
    expect(findByTestAttr(wrapper, 'verified')).toHaveLength(0);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('redux piece of state', () => {
    const reduxProps = {
      auth: {
        confirmEmailForm: wrapper.props().confirmEmailForm,
        user: wrapper.props().user,
        isLoggedIn: wrapper.props().isLoggedIn,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"verifyEmailAuth" action creator', () => {
    const verifyEmailAuthProps = wrapper.instance().props.verifyEmailAuth;
    expect(verifyEmailAuthProps).toBeInstanceOf(Function);
  });

  it('"sendEmailVerificationAuth" action creator', () => {
    const sendEmailVerificationAuthProps = wrapper.instance().props.sendEmailVerificationAuth;
    expect(sendEmailVerificationAuthProps).toBeInstanceOf(Function);
  });
});
