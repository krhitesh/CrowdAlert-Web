import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import calcAge from '../../../utils/time';
import NotificationsContainer from '../NotificationsContainer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const getReduxPiece = () => {
  const notifications = {};
  const count = Math.floor(1 + Math.random()*20);
  for(let i = 0; i < count; i++) {
    notifications[`notification-${i}`] = {
      key: `notification-${i}`,
      userPicture: `url-${i}`,
      link: '',
      type: 'type',
      userName: 'userName',
      category: `category-${i}`,
      title: `title-${i}`,
      datetime: new Date().getTime(),
    };
  }

  return {
    notifications: {
      notifications
    }
  };
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<NotificationsContainer {...props} store={store} />).dive();
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...getReduxPiece(),
    markNotificationAsRead: jest.fn(),
  };
  
  checkProps(NotificationsContainer, expectedProps);
});

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup({}, getReduxPiece());
    expect(findByTestAttr(wrapper, 'component-notifications-container').length).toBe(1);
  });

  describe('renders non zero notifications', () => {
    test('does not render nothing here', () => {
      const wrapper = setup({}, getReduxPiece());
      expect(findByTestAttr(wrapper, 'jsx-center-nothing').length).toBe(0);
    });

    describe('renders notification items', () => {
      test('notification item count', () => {
        const reduxPiece = getReduxPiece();
        const wrapper = setup({}, reduxPiece);
        expect(findByTestAttr(wrapper, 'component-notification-item').length).toBe(Object.keys(reduxPiece.notifications.notifications).length);
      });

      describe('notification item', () => {
        test('does not throw warning with expected props', () => {
          const wrapper = setup({}, getReduxPiece());
          const component = findByTestAttr(wrapper, 'component-notification-item').at(0);
          const expectedProps = {
            data: getReduxPiece().notifications.notifications['notification-0']
          };

          checkProps(component, expectedProps);
        });

        describe('render', () => {
          test('renders without error', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0);
            expect(findByTestAttr(component, 'component-notification-item').length).toBe(1);
          });

          test('renders user image', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'component-user-image').length).toBe(1);
          });

          test('renders data link', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'link-data').length).toBe(1);
          });

          test('renders header', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'component-list-header').length).toBe(1);
          });

          test('renders title', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-title').length).toBe(1);
          });

          test('renders datetime', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-datetime').length).toBe(1);
          });

          test('display title', () => {
            const reduxPiece = getReduxPiece();
            const wrapper = setup({}, reduxPiece);
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-title').text()).toBe(reduxPiece.notifications.notifications['notification-0'].title);
          });

          test('display title', () => {
            const reduxPiece = getReduxPiece();
            const wrapper = setup({}, reduxPiece);
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-datetime').text()).toBe(calcAge(reduxPiece.notifications.notifications['notification-0'].datetime));
          });
        });
      });
    });
  });
});

describe('redux props', () => {
  test('redux piece of state', () => {
    const reduxPiece = getReduxPiece();
    const wrapper = setup({}, reduxPiece);
    const reduxProps = {
      notifications: {
        notifications: wrapper.instance().props.notifications
      }
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"markNotificationAsRead" action creator', () => {
    const wrapper = setup({}, getReduxPiece());
    const markNotificationAsReadProp = wrapper.instance().props.markNotificationAsRead;
    expect(markNotificationAsReadProp).toBeInstanceOf(Function);
  });
});
