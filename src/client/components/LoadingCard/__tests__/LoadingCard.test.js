import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import LoadingCard from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  loading: true,
}

/**
 * @function setup
 * @param {Object} props
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<LoadingCard {...setupProps} />);
  return wrapper;
}

test('does not warn with expected props', () => {
  const expectedProps = { ...defaultProps };

  checkProps(LoadingCard, expectedProps);
});

describe('render', () => {
  test('renders component', () => {
    const wrapper = setup();
    expect(findByTestAttr(wrapper, 'component-loading-card').length).toBe(1);
  });

  test('dimmer active', () => {
    const wrapper = setup();
    expect(findByTestAttr(wrapper, 'component-dimmer').prop('active')).toBe(defaultProps.loading);
  });

  test('renders loader', () => {
    const wrapper = setup();
    expect(findByTestAttr(wrapper, 'component-loader').length).toBe(1);
  });

  test('dimmer inactive', () => {
    const wrapper = setup({ loading: false });
    expect(findByTestAttr(wrapper, 'component-dimmer').prop('active')).toBe(false);
  });

  test('renders image', () => {
    const wrapper = setup();
    expect(findByTestAttr(wrapper, 'component-image').length).toBe(1);
  });
});