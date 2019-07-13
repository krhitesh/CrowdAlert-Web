import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import ShareModal from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const setup = (props = {}) => shallow(<ShareModal {...props} />);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    title: 'title',
    children: <React.Fragment />,
    uuid: 'uuid',
  }

  checkProps(ShareModal, expectedProps);
});

describe('render', () => {
  test('renders without error', () => {
    const wrapper = setup({ title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-share-modal').length).toBe(1);
  });

  test('renders header', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-header').length).toBe(1);
  });

  test('renders modal content', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-modal-content').length).toBe(1);
  });

  test('renders whatsapp share', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-wa-share').length).toBe(1);
  });

  test('renders whatsapp share content', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'wa-share-content').length).toBe(1);
  });

  test('renders fb share', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-fb-share').length).toBe(2);
  });

  test('renders fb share content', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'fb-share-content').length).toBe(2);
  });

  test('renders twitter share', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-tw-share').length).toBe(2);
  });

  test('renders twitter share content', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'tw-share-content').length).toBe(2);
  });

  test('renders google plus action', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'gp-share-content').length).toBe(1);
  });

  test('renders modal actions', () => {
    const wrapper = setup({ open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-modal-actions').length).toBe(1);
  });
});