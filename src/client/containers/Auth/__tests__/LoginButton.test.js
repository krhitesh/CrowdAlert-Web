import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { findByTestAttr, checkProps } from "../../../tests/testUtils";
import LoginButton from '../Loginbutton';
Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  login: false,
  signup: false
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<LoginButton {...setupProps} />);
};

test('does not throw warning with expected props', () => {
	const expectedProps = {
		login: false,
		signup: false,
	};

	checkProps(LoginButton, expectedProps);
});

describe('renders', () => {
	test('renders', () => {
		const wrapper = setup({});
		expect(findByTestAttr(wrapper, 'component-login-btn').length).toBe(1);
	});

	test('renders login', () => {
		const wrapper = setup({ login: true, signup: false });
		expect(findByTestAttr(wrapper, 'btn-login').length).toBe(1);
	});

	test('renders signup', () => {
		const wrapper = setup({ login: false, signup: true });
		expect(findByTestAttr(wrapper, 'btn-signup').length).toBe(1);
	});


	test('renders no signup', () => {
		const wrapper = setup({ login: true, signup: false });
		expect(findByTestAttr(wrapper, 'btn-signup').length).toBe(0);
	});

	test('renders no login', () => {
		const wrapper = setup({ login: false, signup: true });
		expect(findByTestAttr(wrapper, 'btn-login').length).toBe(0);
	});
});
