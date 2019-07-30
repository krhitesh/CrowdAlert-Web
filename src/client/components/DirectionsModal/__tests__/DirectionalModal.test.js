import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import DirectionsModal from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  htmlInstructions: ['No directions available'],
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<DirectionsModal {...setupProps} />);
};

test('does not throw warning with expected props', () => {
  checkProps(DirectionsModal, { htmlInstructions: [], children: <React.Fragment /> });
});

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ htmlInstructions: [], children: <React.Fragment /> });
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-directions-modal')).toHaveLength(1);
  });

});
