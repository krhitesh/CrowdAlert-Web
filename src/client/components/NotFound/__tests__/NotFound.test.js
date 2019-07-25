import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import NotFound from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  staticContext: {}
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<NotFound.component {...setupProps} />)
};

test('does not throw warning with expected props', () => {
  checkProps(NotFound, {  ...defaultProps });
});

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-not-found').length).toBe(1);
  });

  test('renders header', () => {
    expect(findByTestAttr(wrapper, 'jsx-header').length).toBe(1);
  })

  test('renders list', () => {
    expect(findByTestAttr(wrapper, 'jsx-link-list').length).toBe(1);
  })

  test('renders link feed', () => {
    expect(findByTestAttr(wrapper, 'link-feed').length).toBe(1);
  })

  test('renders link create location', () => {
    expect(findByTestAttr(wrapper, 'link-create-location').length).toBe(1);
  })

  test('renders link login', () => {
    expect(findByTestAttr(wrapper, 'link-login').length).toBe(1);
  })

  test('renders link signup', () => {
    expect(findByTestAttr(wrapper, 'link-signup').length).toBe(1);
  })

  test('renders link notifications', () => {
    expect(findByTestAttr(wrapper, 'link-notifications').length).toBe(1);
  })


  describe('check props', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup();
    });

    test('link feed', () => {
      expect(findByTestAttr(wrapper, 'link-feed').props().to).toBe('/');
    });

    test('link create location', () => {
      expect(findByTestAttr(wrapper, 'link-create-location').props().to).toBe('/create/location');
    });

    test('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login');
    });

    test('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
    });

    test('link notifications', () => {
      expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
    });
  });
});