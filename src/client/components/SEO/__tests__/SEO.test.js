import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import SEO from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  ...SEO.defaultProps,
};

const setup = (props = {}) => shallow(<SEO {...props} />);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...defaultProps,
  };

  checkProps(SEO, expectedProps);
});

describe('render', () => {
  const props = {
    title: 'SEO title', url: 'SEO URL', description: 'SEO description', image: 'https://i.stack.imgur.com/TAKeR.png?s=48&g=1',
  };
  let wrapper;
  beforeEach(() => {
    wrapper = setup(props);
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-seo')).toHaveLength(1);
  });

  it('renders title tag', () => {
    expect(findByTestAttr(wrapper, 'jsx-title')).toHaveLength(1);
  });

  it('renders meta title', () => {
    expect(findByTestAttr(wrapper, 'meta-title')).toHaveLength(1);
  });

  it('renders meta url', () => {
    expect(findByTestAttr(wrapper, 'meta-url')).toHaveLength(1);
  });

  it('renders meta description', () => {
    expect(findByTestAttr(wrapper, 'meta-description')).toHaveLength(1);
  });

  it('renders meta image', () => {
    expect(findByTestAttr(wrapper, 'meta-image')).toHaveLength(1);
  });

  it('displays title', () => {
    expect(findByTestAttr(wrapper, 'jsx-title').text()).toBe(props.title);
  });

  it('renders meta title with props', () => {
    expect(findByTestAttr(wrapper, 'meta-title').props().content).toBe(props.title);
  });

  it('renders meta url with props', () => {
    expect(findByTestAttr(wrapper, 'meta-url').props().content).toBe(props.url);
  });

  it('renders meta image with props', () => {
    expect(findByTestAttr(wrapper, 'meta-image').props().content).toBe(props.image);
  });

  it('renders meta description with props', () => {
    expect(findByTestAttr(wrapper, 'meta-description').props().content).toBe(props.description);
  });
});
