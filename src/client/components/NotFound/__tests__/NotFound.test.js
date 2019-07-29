import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import NotFound from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  staticContext: {},
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<NotFound.component {...setupProps} />);
};

test('does not throw warning with expected props', () => {
  checkProps(NotFound, { ...defaultProps });
});

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-not-found')).toHaveLength(1);
  });

  it('renders header', () => {
    expect(findByTestAttr(wrapper, 'jsx-header')).toHaveLength(1);
  });

  it('renders list', () => {
    expect(findByTestAttr(wrapper, 'jsx-link-list')).toHaveLength(1);
  });

  it('renders link feed', () => {
    expect(findByTestAttr(wrapper, 'link-feed')).toHaveLength(1);
  });

  it('renders link create location', () => {
    expect(findByTestAttr(wrapper, 'link-create-location')).toHaveLength(1);
  });

  it('renders link login', () => {
    expect(findByTestAttr(wrapper, 'link-login')).toHaveLength(1);
  });

  it('renders link signup', () => {
    expect(findByTestAttr(wrapper, 'link-signup')).toHaveLength(1);
  });

  it('renders link notifications', () => {
    expect(findByTestAttr(wrapper, 'link-notifications')).toHaveLength(1);
  });


  describe('check props', () => {
    // eslint-disable-next-line no-shadow
    let wrapper;
    beforeEach(() => {
      wrapper = setup();
    });

    it('link feed', () => {
      expect(findByTestAttr(wrapper, 'link-feed').props().to).toBe('/');
    });

    it('link create location', () => {
      expect(findByTestAttr(wrapper, 'link-create-location').props().to).toBe('/create/location');
    });

    it('link login', () => {
      expect(findByTestAttr(wrapper, 'link-login').props().to).toBe('/login');
    });

    it('link signup', () => {
      expect(findByTestAttr(wrapper, 'link-signup').props().to).toBe('/signup');
    });

    it('link notifications', () => {
      expect(findByTestAttr(wrapper, 'link-notifications').props().to).toBe('/notifications');
    });
  });
});
