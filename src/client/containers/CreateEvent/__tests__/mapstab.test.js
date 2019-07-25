import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import { findByTestAttr, checkProps, storeFactory } from '../../../tests/testUtils';
import MapsTab from '../mapstab';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  map: {
    lat: 26.3434,
    lng: 80.2321,
    zoom: 14
  },
  createEvents: {
    tabs: {
      isValid: {
        location: true
      }
    },
    details: {
      help: true,
      public: false,
      title: 'title',
      eventType: '',
      anonymous: false,
      description: 'description'
    },
    form: {
      eventID: '',
      imageSelectDisabled: false,
      uploading: false,
    },
    location: {
      mapCenter: {
        lat: 26.3423,
        lng: 80.1213
      },
      text: ''
    }
  }
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<MapsTab {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    handleSaveLocation: jest.fn(),
    details: reduxPiece.createEvents.details,
    reportForm: reduxPiece.createEvents.form,
    map: reduxPiece.createEvents.map,
    tabs: reduxPiece.createEvents.tabs,
    location: reduxPiece.createEvents.location
  };

  checkProps(MapsTab, expectedProps);
});

describe('renders', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-mapstab').length).toBe(1);
  });

  test('renders map wrapper without error', () => {
    expect(findByTestAttr(wrapper, 'mapwrapper').length).toBe(1);
  });

  test('renders sonar without error', () => {
    expect(findByTestAttr(wrapper, 'location-sonar').length).toBe(1);
  });

  test('renders geolocator without error', () => {
    expect(findByTestAttr(wrapper, 'geolocator').length).toBe(1);
  });

  test('renders to details button without error', () => {
    expect(findByTestAttr(wrapper, 'details-btn').length).toBe(1);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  test('has redux piece of state', () => {
    const reduxProps = {
      createEvents: {
        details: wrapper.props().details,
        form: wrapper.props().reportForm,
        tabs: wrapper.props().tabs,
        location: wrapper.props().location
      },
      map: wrapper.props().map,
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"handleSaveLocation" action creator', () => {
    const handleSaveLocationProps = wrapper.props().handleSaveLocation;
    expect(handleSaveLocationProps).toBeInstanceOf(Function);
  });
});
