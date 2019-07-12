import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../../../tests/testUtils';
import Bottombar from '../';
import { Link } from 'react-router-dom';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<Bottombar />);

describe('testing Bottombar component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-bottombar');
    expect(component.length).toBe(1);
  });

  test('renders grid map outline column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-map-outline');
    expect(component.length).toBe(1);
  })

  test('renders grid map camera column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-map-camera');
    expect(component.length).toBe(1);
  })

  test('renders grid bell column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-bell');
    expect(component.length).toBe(1);
  });

  describe('link renders without error', () => {
    test('link create renders without error', () => {
      expect(wrapper.find(Link)).toHaveLength(1);
    });

    test('link create has correct to attribute', () => {
      expect(wrapper.find(Link).props().to).toBe('/create/');
    });
  });
  
});
