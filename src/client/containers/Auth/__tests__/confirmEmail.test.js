import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import {
  findByTestAttr,
  storeFactory,
  checkProps
} from "../../../tests/testUtils";
import ConfirmEmail from "../confirmEmail";

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    user: {
      displayName: "user display name",
      photoURL: ""
    },
    confirmEmailForm: {
      email: true,
      isVerified: true,
      isVerifying: false,
      message: null,
      errors: false
		},
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
  const wrapper = shallow(
    <ConfirmEmail.component {...props} store={store} />
  ).dive();
  return wrapper;
};

test('does not throw warning with expected props', () => {
	const expectedProps = {
		...reduxPiece,
		verifyEmailAuth: jest.fn(),
		sendEmailVerificationAuth: jest.fn()
	};

	checkProps(ConfirmEmail.component, expectedProps);
});

describe('render', () => {
	test('renders without error', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'component-confirm-email').length).toBe(1);
  });
  
  test('renders no errors', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'confirm-email-errors').length).toBe(0);
  });
  
  test('renders verified', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'verified').length).toBe(1);
	});

  test('renders email sent', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'email-sent').length).toBe(1);
  });
  
  test('renders email prompt', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'email-prompt').length).toBe(0);
  });

  test('renders no verifying', () => {
		const	wrapper = setup({}, reduxPiece).dive().dive();
		expect(findByTestAttr(wrapper, 'verifying').length).toBe(0);
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
          message: "error message",
          errors: true
        }
      }
    }
		const	wrapper = setup({}, rp).dive().dive();
		expect(findByTestAttr(wrapper, 'confirm-email-errors').length).toBe(1);
  });
  
  test('renders verifying', () => {
    const rp = {
      auth: {
        ...reduxPiece.auth,
        confirmEmailForm: {
          email: true,
          isVerified: false,
          isVerifying: true,
          message: null,
          errors: false
        }
      }
    };
		const	wrapper = setup({}, rp).dive().dive();
		expect(findByTestAttr(wrapper, 'verifying').length).toBe(1);
  });

  test('renders no verified', () => {
    const rp = {
      auth: {
        ...reduxPiece.auth,
        confirmEmailForm: {
          email: true,
          isVerified: false,
          isVerifying: true,
          message: null,
          errors: false
        }
      }
    };
		const	wrapper = setup({}, rp).dive().dive();
		expect(findByTestAttr(wrapper, 'verified').length).toBe(0);
  });

});

describe("redux props", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  test("redux piece of state", () => {
    const reduxProps = {
      auth: {
        confirmEmailForm: wrapper.props().confirmEmailForm,
				user: wrapper.props().user,
				isLoggedIn: wrapper.props().isLoggedIn,
      }
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"verifyEmailAuth" action creator', () => {
    const verifyEmailAuthProps = wrapper.instance().props.verifyEmailAuth;
    expect(verifyEmailAuthProps).toBeInstanceOf(Function);
	});
	
	test('"sendEmailVerificationAuth" action creator', () => {
    const sendEmailVerificationAuthProps = wrapper.instance().props.sendEmailVerificationAuth;
    expect(sendEmailVerificationAuthProps).toBeInstanceOf(Function);
	});
});
