import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Flag from '../flagwrapper';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  ...Flag.defaultProps
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<Flag {...setupProps} store={store} />);
  return wrapper;
};

test('does not warn with expected props', () => {
  const expectedProps = {
    ...defaultProps
  };

  checkProps(Flag, expectedProps);
});

describe('render', () => {
  describe('renders non basic', () => {
    test('renders without error', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'component-flag-non-basic').length).toBe(1);
    });

    test('renders icon without error', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'icon-flag').length).toBe(1);
    });

    test('does not render basic', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'component-flag-basic').length).toBe(0);
    });
  });

  describe('renders basic', () => {
    test('renders without error', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'component-flag-basic').length).toBe(1);
    });

    test('renders basic icon without error', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'icon-flag').length).toBe(1);
    });

    test('does not render non basic', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'component-flag-non-basic').length).toBe(0);
    });
  });
});

describe('redux props', () => {
  test('"reportSpamStart" action creator', () => {
    const wrapper = setup();
    const reportSpamStartProps = wrapper.props().reportSpamStart;
    expect(reportSpamStartProps).toBeInstanceOf(Function);
  });
});