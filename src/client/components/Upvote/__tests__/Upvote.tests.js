import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Upvote from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  upvotes: {
    upvoteData: {
      'upvote uuid': {
        uuid: 'upvote uuid',
        hasUpvoted: false,
        count: 0,
      }
    }
  }
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<Upvote {...props} store={store} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    fetchUpvotesStart: jest.fn(),
    fetchUpvotesCancel: jest.fn(),
    updateUpvoteStart: jest.fn(),
    updateUpvoteCancel: jest.fn(),
    uuid: 'uuid',
    basic: true,
  };
  checkProps(Upvote, expectedProps);
});

describe('render', () => {
  test('renders basic button', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    ).dive();

    expect(findByTestAttr(wrapper, 'upvote-btn-basic').length).toBe(1);
  });

  test('does not rendre non basic button', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    ).dive();

    expect(findByTestAttr(wrapper, 'upvote-btn').length).toBe(0);
  });

  test('renders basic button', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: false },
      { count: null, hasUpvoted: null },
      reduxPiece,
    ).dive();

    expect(findByTestAttr(wrapper, 'upvote-btn').length).toBe(1);
  });

  test('does not render basic button', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: false },
      { count: null, hasUpvoted: null },
      reduxPiece,
    ).dive();

    expect(findByTestAttr(wrapper, 'upvote-btn-basic').length).toBe(0);
  });
});

describe('redux props', () => {
  test('has redux piece of state', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    );
    const reduxProp = {
      upvotes: {
        upvoteData: {
          [Object.keys(reduxPiece.upvotes.upvoteData)[0]]: wrapper.props().upvotes
        }
      }
    };

    expect(reduxProp).toEqual(reduxPiece);
  });

  test('"fetchUpvotesStart" action creator', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    );
    const fetchUpvotesStartProp = wrapper.props().fetchUpvotesStart;
    expect(fetchUpvotesStartProp).toBeInstanceOf(Function);
  });

  test('"fetchUpvotesCancel" action creator', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    );
    const fetchUpvotesCancelProp = wrapper.props().fetchUpvotesCancel;
    expect(fetchUpvotesCancelProp).toBeInstanceOf(Function);
  });

  test('"updateUpvoteStart" action creator', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    );
    const updateUpvoteStartProp = wrapper.props().updateUpvoteStart;
    expect(updateUpvoteStartProp).toBeInstanceOf(Function);
  });

  test('"updateUpvoteCancel" action creator', () => {
    const wrapper = setup(
      { uuid: 'upvote uuid', basic: true },
      { count: null, hasUpvoted: null },
      reduxPiece,
    );
    const updateUpvoteCancelProp = wrapper.props().updateUpvoteCancel;
    expect(updateUpvoteCancelProp).toBeInstanceOf(Function);
  });
});
