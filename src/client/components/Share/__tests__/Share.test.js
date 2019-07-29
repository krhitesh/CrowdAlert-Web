import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import ShareModal from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const setup = (props = {}) => shallow(<ShareModal {...props} />);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    title: 'title',
    children: <React.Fragment />,
    uuid: 'uuid',
  };

  checkProps(ShareModal, expectedProps);
});

describe('render', () => {
  it('renders without error', () => {
    const wrapper = setup({ title: 'title', children: <React.Fragment />, uuid: 'uuid' });
    expect(findByTestAttr(wrapper, 'component-share-modal')).toHaveLength(1);
  });

  it('renders header', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-header')).toHaveLength(1);
  });

  it('renders modal content', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-modal-content')).toHaveLength(1);
  });

  it('renders whatsapp share', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-wa-share')).toHaveLength(1);
  });

  it('renders whatsapp share content', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'wa-share-content')).toHaveLength(1);
  });

  it('renders fb share', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-fb-share')).toHaveLength(2);
  });

  it('renders fb share content', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'fb-share-content')).toHaveLength(2);
  });

  it('renders twitter share', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-tw-share')).toHaveLength(2);
  });

  it('renders twitter share content', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'tw-share-content')).toHaveLength(2);
  });

  it('renders google plus action', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'gp-share-content')).toHaveLength(1);
  });

  it('renders modal actions', () => {
    const wrapper = setup({
      open: true, title: 'title', children: <React.Fragment />, uuid: 'uuid',
    });
    expect(findByTestAttr(wrapper, 'component-modal-actions')).toHaveLength(1);
  });
});
