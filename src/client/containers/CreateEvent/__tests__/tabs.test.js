import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps, storeFactory } from '../../../tests/testUtils';
import Tabs from '../tabs';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  createEvents: {
    tabs: {
      isValid: {
        location: true,
        details: true,
        images: true,
      },
      activeTab: 1,
    },
    details: {
      eventType: '',
    },
    location: {
      mapCenter: {
        lat: 26.3423,
        lng: 80.1213,
      },
      text: '',
    },
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<Tabs {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    tabs: reduxPiece.createEvents.tabs,
    handleTabChange: jest.fn(),
    location: reduxPiece.createEvents.location,
    details: reduxPiece.createEvents.details,
  };

  checkProps(Tabs, expectedProps);
});

describe('renders', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-tabs')).toHaveLength(1);
  });

  it('renders step 0 without error', () => {
    expect(findByTestAttr(wrapper, 'step-0')).toHaveLength(1);
  });

  it('renders step 1 without error', () => {
    expect(findByTestAttr(wrapper, 'step-1')).toHaveLength(1);
  });

  it('renders step 2 without error', () => {
    expect(findByTestAttr(wrapper, 'step-2')).toHaveLength(1);
  });

  it('renders step 0 content without error', () => {
    expect(findByTestAttr(wrapper, 'step-0-content')).toHaveLength(1);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      createEvents: {
        tabs: wrapper.props().tabs,
        location: wrapper.props().location,
        details: wrapper.props().details,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"handleTabChange" action creator', () => {
    const handleTabChangeProps = wrapper.props().handleTabChange;
    expect(handleTabChangeProps).toBeInstanceOf(Function);
  });
});
