import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import setupGoogleMock from '../../../../../__mocks__/googleMock';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Sonar from '../sonar';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  id: null,
  type: 'other',
  clustered: false,
  updateMapCenter: () => {},
  updateMapZoom: () => {},
  openEventPreview: () => {},
  map: {
    zoom: 4,
  },
  payload: {
    category: '',
    datetime: 0,
    isClustered: false,
    key: '',
    lat: 0.0,
    long: 0.0,
    title: '',
  },
};

const reduxPiece = {
  map: {
    zoom: 4,
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}, dive = true) => {
  const store = storeFactory(initialReduxState);
  const setupProps = { ...defaultProps, ...props };
  const wrapper = dive ? shallow(<Sonar {...setupProps} store={store} />).dive() : shallow(<Sonar {...setupProps} store={store} />);
  return wrapper;
};

beforeAll(setupGoogleMock);

test('does not throw warning with expected props', () => {
  const expectedProps = { ...defaultProps };

  checkProps(Sonar, expectedProps);
});

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ lat: Math.random()*80, lng: Math.random()*80 }, reduxPiece);
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-sonar').length).toBe(1);
  });

  test('renders sonar emitter', () => {
    expect(findByTestAttr(wrapper, 'jsx-emitter').length).toBe(1);
  });

  test('renders sonar wave', () => {
    expect(findByTestAttr(findByTestAttr(wrapper, 'jsx-emitter'), 'jsx-wave').length).toBe(1);
  });

  test('emitter className', () => {
    expect(findByTestAttr(wrapper, 'jsx-emitter').prop('className')).toBe(`sonar-emitter sonar_${defaultProps.type}`);
  });

  test('wave className', () => {
    expect(findByTestAttr(findByTestAttr(wrapper, 'jsx-emitter'), 'jsx-wave').prop('className')).toBe(`sonar-wave sonar_${defaultProps.type}`);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ lat: Math.random()*80, lng: Math.random()*80 }, reduxPiece, false);
  });

  test('has redux piece of state', () => {
    const reduxProps = {
      map: wrapper.instance().props.map,
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"openEventPreview" action creator', () => {
    const openEventPreviewProp = wrapper.instance().props.openEventPreview;
    expect(openEventPreviewProp).toBeInstanceOf(Function);
  });

  test('"updateMapZoom" action creator', () => {
    const updateMapZoomProp = wrapper.instance().props.updateMapZoom;
    expect(updateMapZoomProp).toBeInstanceOf(Function);
  });

  test('"updateMapCenter" action creator', () => {
    const updateMapCenterProp = wrapper.instance().props.updateMapCenter;
    expect(updateMapCenterProp).toBeInstanceOf(Function);
  });
});