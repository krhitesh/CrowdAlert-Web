import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../../../tests/testUtils';
import NotificaitonsDropdown from '../NotificaitonsDropdown';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<NotificaitonsDropdown />);


describe('testing NotificaitonsDropdown component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown');
    expect(component.length).toBe(1);
  });

  test('renders segment header without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown-segment-header');
    expect(component.length).toBe(1);
  });

  test('renders segment notifications container without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown-segment-notifications-container');
    expect(component.length).toBe(1);
  });
  
});