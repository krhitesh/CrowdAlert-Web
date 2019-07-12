import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import Footer from '../Footer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => shallow(<Footer {...props} />);

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup({ title: 'No title', uuid: 'uuid' });
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-footer').length).toBe(1);
  });

  test('renders upvote button without error', () => {
    expect(findByTestAttr(wrapper, 'component-upvote-btn').length).toBe(1);
  });

  test('renders share modal without error', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal').length).toBe(1);
  });

  test('renders share button without error', () => {
    expect(findByTestAttr(wrapper, 'jsx-btn-share').length).toBe(1);
  });

  test('renders spam report flag without error', () => {
    expect(findByTestAttr(wrapper, 'component-spamreport-flag').length).toBe(1);
  })
});

describe('props', () => {
  let wrapper;
  const props = {
    title: 'No title', 
    uuid: 'uuid'
  };

  beforeEach(() => {
    wrapper = setup(props);
  });

  test('upvote button props', () => {
    expect(findByTestAttr(wrapper, 'component-upvote-btn').prop('uuid')).toEqual(props.uuid);
  });

  test('share modal uuid prop', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal').prop('uuid')).toEqual(props.uuid);
  });

  test('share modal title prop', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal').prop('title')).toEqual(props.title);
  });

  test('spam report flag props', () => {
    expect(findByTestAttr(wrapper, 'component-spamreport-flag').prop('uuid')).toEqual(props.uuid);
  });

});

test('does not throw warning with expected props', () => {
  const expectedProps = { title: 'No title', uuid: 'uuid' };
  checkProps(Footer, expectedProps);
});
