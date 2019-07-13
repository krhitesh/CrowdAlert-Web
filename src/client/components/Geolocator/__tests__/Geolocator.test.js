import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import GeoLocator from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  static: false,
  size: 'huge',
  circular: true,
  fetchOnLoad: false,
  floated: 'right',
};

const reduxPiece = {
  geoLocator: {
    modalText: 'Text',
    isOpen: false,
    closeModal: () => {}
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
  const wrapper = shallow(<GeoLocator {...setupProps} store={store} />).dive();
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    getLocation: jest.fn(),
    closeModal: jest.fn(),
    ...defaultProps,
    modal: {      
      ...defaultProps.modal,
      modalText: 'Text',
    }
  };

  checkProps(GeoLocator, expectedProps);
});

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup({}, reduxPiece);
    expect(findByTestAttr(wrapper, 'component-geolocator').length).toBe(1);
  });

  test('renders button', () => {
    const wrapper = setup({}, reduxPiece);
    expect(findByTestAttr(wrapper, 'jsx-geolocator-btn').length).toBe(1);
  });

  
  describe('renders confirmation modal', () => {
    test('renders confirmation modal', () => {
      const wrapper = setup({}, reduxPiece);
      expect(findByTestAttr(wrapper, 'component-confirmation-modal').length).toBe(1);
    });
    
    test('renders modal content p', () => {
      const wrapper = setup({}, reduxPiece);
      const component = findByTestAttr(wrapper, 'component-confirmation-modal').dive();

      expect(findByTestAttr(component, 'jsx-prop-text').text()).toBe(reduxPiece.geoLocator.modalText);
    });

    test('renders modal button', () => {
      const wrapper = setup({}, reduxPiece);
      const component = findByTestAttr(wrapper, 'component-confirmation-modal').dive();

      expect(findByTestAttr(component, 'jsx-ok-btn').length).toBe(1);
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
      geoLocator: wrapper.instance().props.modal,
    }

    expect(reduxProps).toEqual(reduxPiece);
  });

  test('"getLocation" action creator', () => {
    const getLocationProp = wrapper.instance().props.getLocation;
    expect(getLocationProp).toBeInstanceOf(Function);
  });

  test('"closeModal" action creator', () => {
    const closeModalProps = wrapper.instance().props.closeModal;
    expect(closeModalProps).toBeInstanceOf(Function);
  });
});
