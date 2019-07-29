import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../../../tests/testUtils';
import NotificationsPage from '../NotificationsPage';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<NotificationsPage.component />);

describe('testing NotificationsPage component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  it('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-page');
    expect(component).toHaveLength(1);
  });

  it('renders segment notifications container error', () => {
    const component = findByTestAttr(wrapper, 'component-notifications-page-segment-notifications-container');
    expect(component).toHaveLength(1);
  });
});
