import React from 'react';
import Enzyme, { shallow } from 'enzyme';
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

  it('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown');
    expect(component).toHaveLength(1);
  });

  it('renders segment header without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown-segment-header');
    expect(component).toHaveLength(1);
  });

  it('renders segment notifications container without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-dropdown-segment-notifications-container');
    expect(component).toHaveLength(1);
  });
});
