import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import NotificationModal from '../NotificationModal';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  notifications: {
    modal: {
      open: true,
      icon: 'moon',
      header: 'header',
      text: 'text',
    },
    permission: true,
  }
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<NotificationModal {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...reduxPiece,
    showNotificationPermissionAsk: jest.fn(),
    showNotificationPermissionClose: jest.fn()
  }

  checkProps(NotificationModal, expectedProps);
});

describe('render', () => {
  test('renders modal', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-notifications-modal').length).toBe(1);
  });

  test('renders header icon', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-header-icon').length).toBe(1);
  });

  test('renders modal text', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'jsx-modal-text').text()).toBe(reduxPiece.notifications.modal.text);
  });

  test('renders modal permission action', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-allow-btn').length).toBe(1);
  });

  test('renders close button', () => {
    const wrapper = setup({}, reduxPiece).dive();
    expect(findByTestAttr(wrapper, 'component-close-btn').length).toBe(1);
  });

  test('does not render allow button', () => {
    const wrapper = setup({}, { notifications: { ...reduxPiece.notifications, permission: false } }).dive();
    expect(findByTestAttr(wrapper, 'component-allow-btn').length).toBe(0);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  })

  test('redux piece of state', () => {
    const reduxProps = {
      notifications: {
        modal: wrapper.props().modal,
        permission: wrapper.props().permission,
      }
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"showNotificationPermissionAsk" action creator', () => {
    const showNotificationPermissionAskProps = wrapper.props().showNotificationPermissionAsk;
    expect(showNotificationPermissionAskProps).toBeInstanceOf(Function);
  });

  test('"showNotificationPermissionClose" action creator', () => {
    const showNotificationPermissionCloseProps = wrapper.props().showNotificationPermissionClose;
    expect(showNotificationPermissionCloseProps).toBeInstanceOf(Function);
  });
});
