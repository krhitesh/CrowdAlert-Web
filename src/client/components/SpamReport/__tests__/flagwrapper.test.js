import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Flag from '../flagwrapper';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  ...Flag.defaultProps,
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
    ...defaultProps,
  };

  checkProps(Flag, expectedProps);
});

describe('render', () => {
  describe('renders non basic', () => {
    it('renders without error', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'component-flag-non-basic')).toHaveLength(1);
    });

    it('renders icon without error', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'icon-flag')).toHaveLength(1);
    });

    it('does not render basic', () => {
      const wrapper = setup().dive();
      expect(findByTestAttr(wrapper, 'component-flag-basic')).toHaveLength(0);
    });
  });

  describe('renders basic', () => {
    it('renders without error', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'component-flag-basic')).toHaveLength(1);
    });

    it('renders basic icon without error', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'icon-flag')).toHaveLength(1);
    });

    it('does not render non basic', () => {
      const wrapper = setup({ basic: true }).dive();
      expect(findByTestAttr(wrapper, 'component-flag-non-basic')).toHaveLength(0);
    });
  });
});

describe('redux props', () => {
  it('"reportSpamStart" action creator', () => {
    const wrapper = setup();
    const reportSpamStartProps = wrapper.props().reportSpamStart;
    expect(reportSpamStartProps).toBeInstanceOf(Function);
  });
});
