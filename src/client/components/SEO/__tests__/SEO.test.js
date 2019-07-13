import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import SEO from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  ...SEO.defaultProps
};

const setup = (props = {}) => shallow(<SEO {...props} />);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...defaultProps
  };

  checkProps(SEO, expectedProps);
});

describe('render', () => {
  const props = { title: 'SEO title', url: 'SEO URL', description: 'SEO description', image: 'https://i.stack.imgur.com/TAKeR.png?s=48&g=1' };
  let wrapper;
  beforeEach(() => {
    wrapper = setup(props);
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-seo').length).toBe(1);
  });

  test('renders title tag', () => {
    expect(findByTestAttr(wrapper, 'jsx-title').length).toBe(1);
  });

  test('renders meta title', () => {
    expect(findByTestAttr(wrapper, 'meta-title').length).toBe(1);
  });

  test('renders meta url', () => {
    expect(findByTestAttr(wrapper, 'meta-url').length).toBe(1);
  });

  test('renders meta description', () => {
    expect(findByTestAttr(wrapper, 'meta-description').length).toBe(1);
  });

  test('renders meta image', () => {
    expect(findByTestAttr(wrapper, 'meta-image').length).toBe(1);
  });

  test('displays title', () => {
    expect(findByTestAttr(wrapper, 'jsx-title').text()).toBe(props.title);
  });

  test('renders meta title', () => {
    expect(findByTestAttr(wrapper, 'meta-title').props().content).toBe(props.title);
  });

  test('renders meta url', () => {
    expect(findByTestAttr(wrapper, 'meta-url').props().content).toBe(props.url);
  });

  test('renders meta image', () => {
    expect(findByTestAttr(wrapper, 'meta-image').props().content).toBe(props.image);
  });

  test('renders meta description', () => {
    expect(findByTestAttr(wrapper, 'meta-description').props().content).toBe(props.description);
  });

});
