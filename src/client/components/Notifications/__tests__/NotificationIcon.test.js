import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import NotificationIcon from '../NotificationIcon';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  notifications: {
    unread: true,
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<NotificationIcon {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    undread: false,
  };

  checkProps(NotificationIcon, expectedProps);
});

describe('render', () => {
  test('renders component', () => {
    const wrapper = setup({}, { notifications: { unread: false } }).dive();
    expect(findByTestAttr(wrapper, 'component-notification-icon').length).toBe(1);
  });

  test('does not render red icon', () => {
    const wrapper = setup({}, { notifications: { unread: false } }).dive();
    expect(findByTestAttr(wrapper, 'component-icon').length).toBe(0);
  });

  test('renders red icon', () => {
    const wrapper = setup({}, { notifications: { unread: true } }).dive();
    expect(findByTestAttr(wrapper, 'component-icon').length).toBe(1);
  });
});

describe('redux props', () => {
  test('has redux piece of state', () => {
    const wrapper = setup({}, reduxPiece);
    const reduxProps = {
      notifications: {
        unread: wrapper.props().unread,
      }
    }

    expect(reduxProps).toEqual(reduxPiece);
  });
});