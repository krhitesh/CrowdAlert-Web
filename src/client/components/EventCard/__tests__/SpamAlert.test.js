import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../../../tests/testUtils';
import SpamAlert from '../SpamAlert';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<SpamAlert />);

describe('testing SpamAlert component', () => {
  const wrapper = setup();

  it('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-spamalert');
    expect(component).toHaveLength(1);
  });
});
