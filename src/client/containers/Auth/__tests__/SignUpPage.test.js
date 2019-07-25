import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import LoginPage from '../SignUpPage';

Enzyme.configure({ adapter: new EnzymeAdapter() });

// Can pass empty Object {} too.
const reduxPiece = {
  auth: {
    isLoggedIn: false,
  }
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
        setBottomBarVisibility: jest.fn(),
        removeBottomBarVisibility: jest.fn()
    };

    checkProps(LoginPage.component, expectedProps);
});

describe('render test', () => {
    test('renders login page component without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'component-signup-page').length).toBe(1);
    });

    test('renders login form component without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'component-signup-form').length).toBe(1);
    });

    test('renders oauth component without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'component-oauth').length).toBe(1);
    });

    test('renders responsivev login form component without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'res-signup-form').length).toBe(1);
    });

    test('renders signup link without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'link-login').length).toBe(1);
    });
    
    test('renders responsive oauth component without errors', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'res-component-oauth').length).toBe(1);
    });
});

describe('redux props', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece);
    });

    test('"removeBottomBarVisibility" action creator', () => {
        const removeBottomBarVisibilityProps = wrapper.props().removeBottomBarVisibility;
        expect(removeBottomBarVisibilityProps).toBeInstanceOf(Function);
    });

    test('"setBottomBarVisibility" action creator', () => {
        const setBottomBarVisibilityProps = wrapper.props().setBottomBarVisibility;
        expect(setBottomBarVisibilityProps).toBeInstanceOf(Function);
    });
});
