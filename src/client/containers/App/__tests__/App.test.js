import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { StaticRouter } from 'react-router-dom';
import { storeFactory, checkProps } from '../../../tests/testUtils';
import App from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    isLoggedIn: false,
    authenticating: false,
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
// eslint-disable-next-line no-unused-vars
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  // eslint-disable-next-line max-len
  const wrapper = shallow(<StaticRouter context={{}}><App.component {...props} store={store} /></StaticRouter>).dive();
  console.log(wrapper.debug());
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    checkUserAuthenticationStatus: jest.fn(),
    route: {
      routes: [],
    },
    ...reduxPiece,
  };

  checkProps(App.component, expectedProps);
});
