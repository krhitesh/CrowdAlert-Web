import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import { findByTestAttr } from '../../../tests/testUtils';
import Bottombar from '../';

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

  it('renders without error', () => {
    expect.hasAssertions();
    const component = findByTestAttr(wrapper, 'component-bottombar');
    expect(component).toHaveLength(1);
  });

  it('renders grid map outline column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-map-outline');
    expect(component).toHaveLength(1);
  });

  it('renders grid map camera column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-map-camera');
    expect(component).toHaveLength(1);
  });

  it('renders grid bell column without error', () => {
    const component = findByTestAttr(wrapper, 'component-grid-bell');
    expect(component).toHaveLength(1);
  });

  describe('link renders without error', () => {
    it('link create renders without error', () => {
      expect(wrapper.find(Link)).toHaveLength(1);
    });

    it('link create has correct to attribute', () => {
      expect(wrapper.find(Link).props().to).toBe('/create/');
    });
  });
});
