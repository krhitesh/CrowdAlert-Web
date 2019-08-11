import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import setupNavigatorMock from '../../../../../__mocks__/navigatorMock';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Feed from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  eventPreview: {
    isOpen: false,
  },
  map: {
    lat: 26.2323,
    lng: 80.2322,
    zoom: 14,
  },
  feed: {
    0: { key: 'TEST' },
    11: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.517079178420964, long: 80.23280679139403, category: 'health', title: 'Death', datetime: 1562598644434, isClustered: true,
      },
    },
    12: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.515999258988806, long: 80.23443597447508, category: 'health', title: 'Death', datetime: 1562598644434, isClustered: true,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
    },
    13: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.506144655813888, long: 80.23529520635987, category: 'health', title: 'Death', datetime: 1562598644434,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
      ylFaLmmIsW6AUd1EHS1r: {
        key: 'ylFaLmmIsW6AUd1EHS1r', lat: 26.51894959240159, long: 80.23443514947508, category: 'electric', title: 'Firestore test 1', datetime: 1562598383931, isClustered: true,
      },
    },
    14: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.506144655813888, long: 80.23529520635987, category: 'health', title: 'Death', datetime: 1562598644434,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
      ylFaLmmIsW6AUd1EHS1r: {
        key: 'ylFaLmmIsW6AUd1EHS1r', lat: 26.51894959240159, long: 80.23443514947508, category: 'electric', title: 'Firestore test 1', datetime: 1562598383931, isClustered: true,
      },
    },
    15: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.506144655813888, long: 80.23529520635987, category: 'health', title: 'Death', datetime: 1562598644434,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
      ylFaLmmIsW6AUd1EHS1r: {
        key: 'ylFaLmmIsW6AUd1EHS1r', lat: 26.517945989465012, long: 80.23529190635986, category: 'electric', title: 'Firestore test 1', datetime: 1562598383931,
      },
      BAncvwpWEbywrYp281K6: {
        key: 'BAncvwpWEbywrYp281K6', lat: 26.519953195338164, long: 80.23357839259029, category: 'road', title: 'Crash', datetime: 1562600516657,
      },
    },
    16: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.506144655813888, long: 80.23529520635987, category: 'health', title: 'Death', datetime: 1562598644434,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
      ylFaLmmIsW6AUd1EHS1r: {
        key: 'ylFaLmmIsW6AUd1EHS1r', lat: 26.517945989465012, long: 80.23529190635986, category: 'electric', title: 'Firestore test 1', datetime: 1562598383931,
      },
      BAncvwpWEbywrYp281K6: {
        key: 'BAncvwpWEbywrYp281K6', lat: 26.519953195338164, long: 80.23357839259029, category: 'road', title: 'Crash', datetime: 1562600516657,
      },
    },
    17: {
      '0YAou5LPbyVMjRtHBV6X': {
        key: '0YAou5LPbyVMjRtHBV6X', lat: 26.506144655813888, long: 80.23529520635987, category: 'health', title: 'Death', datetime: 1562598644434,
      },
      cL1z6l9TQ7FpK6ypgLwF: {
        key: 'cL1z6l9TQ7FpK6ypgLwF', lat: 26.51478401127116, long: 80.22226174171146, category: 'nature', title: 'Heavy rain', datetime: 1562598791192,
      },
      ylFaLmmIsW6AUd1EHS1r: {
        key: 'ylFaLmmIsW6AUd1EHS1r', lat: 26.517945989465012, long: 80.23529190635986, category: 'electric', title: 'Firestore test 1', datetime: 1562598383931,
      },
      BAncvwpWEbywrYp281K6: {
        key: 'BAncvwpWEbywrYp281K6', lat: 26.519953195338164, long: 80.23357839259029, category: 'road', title: 'Crash', datetime: 1562600516657,
      },
    },
  },
  auth: {
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
  const wrapper = shallow(<Feed.component {...props} store={store} />);
  return wrapper;
};

beforeAll(setupNavigatorMock);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    feedProps: reduxPiece.feed,
    mapProps: reduxPiece.map,
    isLoggedIn: true,
    fetchEventsByLocation: jest.fn(),
    fetchEventsByLocationOverWebSocket: jest.fn(),
    fetchUserLocation: jest.fn(),
  };

  checkProps(Feed.component, expectedProps);
});


describe('render test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ match: { params: { eventid: 'eventid' } } }, reduxPiece).dive();
  });

  it('renders without errors', () => {
    expect(findByTestAttr(wrapper, 'component-feed')).toHaveLength(1);
  });

  it('renders map wrapper without errors', () => {
    expect(findByTestAttr(wrapper, 'component-map-wrapper')).toHaveLength(1);
  });

  it('renders event preview card without errors', () => {
    expect(findByTestAttr(wrapper, 'component-event-preview-card')).toHaveLength(1);
  });

  it('renders geolocator without errors', () => {
    expect(findByTestAttr(wrapper, 'component-geolocator')).toHaveLength(1);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      map: wrapper.props().mapProps,
      feed: wrapper.props().feedProps,
      auth: {
        isLoggedIn: wrapper.props().isLoggedIn,
      },
      eventPreview: wrapper.props().eventPreview,
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"fetchUserLocation" action creator', () => {
    const fetchUserLocationProps = wrapper.props().fetchUserLocation;
    expect(fetchUserLocationProps).toBeInstanceOf(Function);
  });

  it('"fetchEventsByLocation" action creator', () => {
    const fetchEventsByLocationProps = wrapper.props().fetchEventsByLocation;
    expect(fetchEventsByLocationProps).toBeInstanceOf(Function);
  });

  it('"fetchEventsByLocationOverWebSocket" action creator', () => {
    const fetchEventsByLocationOverWebSocketProps = wrapper.props()
      .fetchEventsByLocationOverWebSocket;
    expect(fetchEventsByLocationOverWebSocketProps).toBeInstanceOf(Function);
  });

  it('"updateMapPolyline" action creator', () => {
    const updateMapPolylineProps = wrapper.props()
      .updateMapPolyline;
    expect(updateMapPolylineProps).toBeInstanceOf(Function);
  });
});
