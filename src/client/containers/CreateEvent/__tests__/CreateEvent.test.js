import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import CreateEvent from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  auth: {
    isLoggedIn: true,
  },
  createEvents: {
    tabs: {},
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<CreateEvent.pureComponent {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    match: {
      path: '/',
      isExact: true,
      params: {},
      url: '',
    },
    tabs: reduxPiece.createEvents.tabs,
  };

  checkProps(CreateEvent.pureComponent, expectedProps);
});

describe('renders', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(
      {
        match: {
          path: '',
          isExact: true,
          params: {},
          url: '',
        },
      },
      reduxPiece,
    ).dive();
  });

  it('renders without errors', () => {
    // console.log(wrapper.debug());
    expect(findByTestAttr(wrapper, 'component-create-event')).toHaveLength(1);
  });

  it('renders maptab route without errors', () => {
    expect(findByTestAttr(wrapper, 'maptab-route')).toHaveLength(1);
  });

  it('renders formtab route without errors', () => {
    expect(findByTestAttr(wrapper, 'formtab-route')).toHaveLength(1);
  });

  it('renders imagetab without errors', () => {
    expect(findByTestAttr(wrapper, 'imagetab-route')).toHaveLength(1);
  });
});

test('has redux piece of state', () => {
  const wrapper = setup(
    {
      match: {
        path: '',
        isExact: true,
        params: {},
        url: '',
      },
    },
    reduxPiece,
  );

  const reduxProps = {
    auth: {
      ...reduxPiece.auth,
    },
    createEvents: {
      tabs: wrapper.props().tabs,
    },
  };

  expect(reduxProps).toEqual(reduxPiece);
});
