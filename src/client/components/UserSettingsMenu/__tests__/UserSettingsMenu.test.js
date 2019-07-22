import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import UserSettingsMenu from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
    open: false
};

const reduxPiece = {
  auth: {
    user: {
        displayName: 'user display name',
        email: 'user@gmail.com',
        photoURL: ''
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
        ...reduxPiece
    };

    checkProps(UserSettingsMenu, expectedProps);
});

describe('renders', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece).dive();
    });

    test('renders without error', () => {
        expect(findByTestAttr(wrapper, 'component-user-settings-menu').length).toBe(1);
    });

    test('renders user image', () => {
        expect(findByTestAttr(wrapper, 'component-image').length).toBe(1);
    });

    test('renders header content', () => {
        expect(findByTestAttr(wrapper, 'component-header-content').length).toBe(1);
    });

    describe('renders drop down items', () => {
        test('renders settings item', () => {
            expect(findByTestAttr(wrapper, 'item-settings').length).toBe(1);
        });

        test('renders user item', () => {
            expect(findByTestAttr(wrapper, 'item-user').length).toBe(1);
        });

        test('renders privacy item', () => {
            expect(findByTestAttr(wrapper, 'item-privacy').length).toBe(1);
        });

        test('renders tasks item', () => {
            expect(findByTestAttr(wrapper, 'item-tasks').length).toBe(1);
        });

        test('renders sign out item', () => {
            expect(findByTestAttr(wrapper, 'item-sign-out').length).toBe(1);
        });
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
                user: wrapper.props().user,
                isLoggedIn: wrapper.props().isLoggedIn
            }
        };

        expect(reduxProps).toEqual(reduxPiece);
    });

    test('"signOut" action creator', () => {
        const signOutProps = wrapper.props().signOut;
        expect(signOutProps).toBeInstanceOf(Function);
    });
});

