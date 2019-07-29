import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { storeFactory, checkProps } from '../../../tests/testUtils';
import OAuth from '../OAuth';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    loginForm: {},
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<OAuth {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    loginForm: {},
  };

  checkProps(OAuth, expectedProps);
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      auth: {
        loginForm: wrapper.props().loginForm,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"signInOAuthProps" action creator', () => {
    const signInOAuthProps = wrapper.props().signInOAuth;
    expect(signInOAuthProps).toBeInstanceOf(Function);
  });
});
