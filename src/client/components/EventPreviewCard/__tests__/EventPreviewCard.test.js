import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import { findByTestAttr, checkProps, storeFactory } from '../../../tests/testUtils';
import EventPreviewCard from '../';
import calcAge from '../../../utils/time';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  eventPreview: null,
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<EventPreviewCard {...defaultProps} {...props} store={store} />);
  return wrapper;
};

test('no render', () => {
  const reduxPiece = {
    eventPreview: {
      event: null,
      isOpen: false,
    }
  };
  const wrapper = setup({}, { ...reduxPiece });

  expect(findByTestAttr(wrapper, 'component-event-preview-card').length).toBe(0);
});

const reduxPiece = {
  eventPreview: {
    event: {
      key: 'event key',
      lat: Math.random()*80,
      long: Math.random()*80,
      category: 'event category',
      title: 'event title',
      datetime: new Date().getTime()
    },
    isOpen: false,
  }
};

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { ...reduxPiece }).dive();
  });

  test('event category header test', () => {
    expect(findByTestAttr(wrapper, 'component-header').length).toBe(2);
  });

  test('event title header test', () => {
    expect(findByTestAttr(wrapper, 'component-title').length).toBe(2);
  });

  test('event datetime p test', () => {
    expect(findByTestAttr(wrapper, 'jsx-datetime').length).toBe(2);
  });

  test('Links', () => {
    expect(wrapper.find(Link)).toHaveLength(2);
  })

});

describe('props test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { ...reduxPiece }).dive();
  });

  test('Link props test', () => { 
    expect(wrapper.find(Link).at(0).props().to).toBe(`/view/${reduxPiece.eventPreview.event.key}`)
  });

  test('does not throw warning with expected props', () => {
    const expectedProps = { ...reduxPiece };
    checkProps(EventPreviewCard, expectedProps);
  });

  test('event category value', () => {
    expect(findByTestAttr(wrapper, 'component-header').at(0).dive().text()).toBe(reduxPiece.eventPreview.event.category.toLocaleUpperCase());
  });

  test('event title value', () => {
    expect(findByTestAttr(wrapper, 'component-title').at(0).dive().text()).toBe(reduxPiece.eventPreview.event.title);
  });

  test('event datetime value', () => {
    expect(findByTestAttr(wrapper, 'jsx-datetime').at(0).text()).toBe(calcAge(reduxPiece.eventPreview.event.datetime));
  });

});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, { ...reduxPiece });
  });

  test('has redux piece of state', () => {
    const reduxProp = {
      eventPreview: wrapper.props().eventPreview,
    }

    expect(reduxProp).toEqual(reduxPiece);
  });

  test('"closeEventPreview" action creator', () => {
    const closeEventPreviewProp = wrapper.props().closeEventPreview;
    expect(closeEventPreviewProp).toBeInstanceOf(Function);
  });

});