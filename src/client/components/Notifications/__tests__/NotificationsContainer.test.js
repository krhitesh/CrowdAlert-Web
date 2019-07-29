import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import calcAge from '../../../utils/time';
import NotificationsContainer from '../NotificationsContainer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const getReduxPiece = () => {
  const notifications = {};
  const count = Math.floor(1 + (Math.random() * 20));
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
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
      notifications,
    },
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
  it('renders without error', () => {
    const wrapper = setup({}, getReduxPiece());
    expect(findByTestAttr(wrapper, 'component-notifications-container')).toHaveLength(1);
  });

  describe('renders non zero notifications', () => {
    it('does not render nothing here', () => {
      const wrapper = setup({}, getReduxPiece());
      expect(findByTestAttr(wrapper, 'jsx-center-nothing')).toHaveLength(0);
    });

    describe('renders notification items', () => {
      it('notification item count', () => {
        const reduxPiece = getReduxPiece();
        const wrapper = setup({}, reduxPiece);
        expect(findByTestAttr(wrapper, 'component-notification-item')).toHaveLength(Object.keys(reduxPiece.notifications.notifications).length);
      });

      describe('notification item', () => {
        it('does not throw warning with expected props', () => {
          const wrapper = setup({}, getReduxPiece());
          const component = findByTestAttr(wrapper, 'component-notification-item').at(0);
          const expectedProps = {
            data: getReduxPiece().notifications.notifications['notification-0'],
          };

          checkProps(component, expectedProps);
        });

        describe('render', () => {
          it('renders without error', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0);
            expect(findByTestAttr(component, 'component-notification-item')).toHaveLength(1);
          });

          it('renders user image', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'component-user-image')).toHaveLength(1);
          });

          it('renders data link', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'link-data')).toHaveLength(1);
          });

          it('renders header', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'component-list-header')).toHaveLength(1);
          });

          it('renders title', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-title')).toHaveLength(1);
          });

          it('renders datetime', () => {
            const wrapper = setup({}, getReduxPiece());
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-datetime')).toHaveLength(1);
          });

          it('display title', () => {
            const reduxPiece = getReduxPiece();
            const wrapper = setup({}, reduxPiece);
            const component = findByTestAttr(wrapper, 'component-notification-item').at(0).dive();
            expect(findByTestAttr(component, 'jsx-title').text()).toBe(reduxPiece.notifications.notifications['notification-0'].title);
          });

          it('displays datetime text', () => {
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
  it('redux piece of state', () => {
    const reduxPiece = getReduxPiece();
    const wrapper = setup({}, reduxPiece);
    const reduxProps = {
      notifications: {
        notifications: wrapper.instance().props.notifications,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"markNotificationAsRead" action creator', () => {
    const wrapper = setup({}, getReduxPiece());
    const markNotificationAsReadProp = wrapper.instance().props.markNotificationAsRead;
    expect(markNotificationAsReadProp).toBeInstanceOf(Function);
  });
});
