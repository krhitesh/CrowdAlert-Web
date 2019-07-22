import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import { StaticRouter } from 'react-router-dom';
import App from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
	auth: {
		isLoggedIn: false,
		authenticating: false,
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
		<StaticRouter context={{}}>
			<App.component {...props} store={store} />
		</StaticRouter>
	).dive();
	console.log(wrapper.debug());
	return wrapper;
};

test('does not throw warning with expected props', () => {
	const expectedProps = {
		checkUserAuthenticationStatus: jest.fn(),
		route: {
			routes: [],
		},
		...reduxPiece,
	};

	checkProps(App.component, expectedProps);
});

describe('redux props', () => {
	let wrapper;
	beforeEach(() => {
		wrapper = setup({}, reduxPiece);
	});

	// test('redux piece of state', () => {
	// 	const reduxProps = {
	// 		auth: {
	// 			isLoggedIn: wrapper.props().isLoggedIn,
	// 			authenticating: wrapper.props().authenticating
	// 		}
	// 	};

	// 	expect(reduxProps).toEqual(reduxPiece);
	// });

	// test('"checkUserAuthenticationStatus" action creator', () => {
	// 	console.log(wrapper.props());
	// 	const checkUserAuthenticationStatusProps = wrapper.instance().props.checkUserAuthenticationStatus;
    // 	expect(checkUserAuthenticationStatusProps).toBeInstanceOf(Function);
	// });
});