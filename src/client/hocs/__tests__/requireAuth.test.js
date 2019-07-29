/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../tests/testUtils';
import requireAuth from '../requireAuth';

Enzyme.configure({ adapter: new EnzymeAdapter() });

class TestComponent extends React.Component {
  render() {
    return (
      <div>
        <p>Test component</p>
      </div>
    );
  }
}

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState) => {
  const HOC = requireAuth(TestComponent);
  const store = storeFactory(initialReduxState);
  return shallow(<HOC {...props} store={store} />);
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    isLoggedIn: true,
  };

  const HOC = requireAuth(TestComponent);
  checkProps(HOC, expectedProps);
});

describe('renders', () => {
  it('renders test component when user is logged in', () => {
    const wrapper = setup({}, { auth: { isLoggedIn: true } }).dive();
    expect(findByTestAttr(wrapper, 'component-child-component')).toHaveLength(1);
  });

  it('renders redirect component when user is logged in', () => {
    const wrapper = setup({}, { auth: { isLoggedIn: false } }).dive();
    expect(findByTestAttr(wrapper, 'component-redirect')).toHaveLength(1);
  });
});

describe('redux props', () => {
  it('has redux piece of state', () => {
    const wrapper = setup({}, { auth: { isLoggedIn: false } });
    const reduxProps = {
      isLoggedIn: wrapper.props().isLoggedIn,
    };

    expect(reduxProps).toEqual({ isLoggedIn: false });
  });
});
