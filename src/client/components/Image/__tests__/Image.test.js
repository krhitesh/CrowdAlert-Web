import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import { GET_IMAGE_URLS } from '../../../utils/apipaths';
import ImageModal from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  uuid: null,
  base64: null,
  isTrusted: false,
  children: null,
};

const stateProps = {
  uuid: '-Lhxl37VGpyQM7KjM3am',
  loading: false,
  base64: 'base64',
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  const setupProps = { ...defaultProps, ...props };
  const wrapper = mount(<ImageModal {...setupProps} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    uuid: '',
    base64: '',
    children: <React.Fragment />,
    isTrusted: true,
  };

  checkProps(ImageModal, expectedProps);
});

describe('test state', () => {
  const base64StateProps = {
    uuid: null,
    loading: true,
    base64: 'base64'
  };

  const nullProps = {
    uuid: null,
    loading: true,
    base64: null,
  };
  
  test('uuid prop', () => {
    const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
    expect(wrapper.state('uuid')).toBe(stateProps.uuid);
  });

  test('loading prop', () => {
    const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
    expect(wrapper.state('loading')).toBe(stateProps.loading);
  });

  test('base64 prop', () => {
    const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
    expect(wrapper.state('base64')).toBe(stateProps.base64);
  });

  test('image urls', () => {
    const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
    expect(wrapper.state('imageUrls')).toEqual({
      url: `${GET_IMAGE_URLS}?uuid=${stateProps.uuid}`,
      thumbnail: `${GET_IMAGE_URLS}?uuid=${stateProps.uuid}&mode=thumbnail`,
    });
  });

  test('image as base64 state prop', () => {
    const wrapper = setup({ isTrusted: true, ...base64StateProps }, base64StateProps);
    expect(wrapper.state('imageUrls')).toEqual({
      url: base64StateProps.base64,
      thumbnail: base64StateProps.base64,
    });
  });

  test('null state prop', () => {
    const wrapper = setup({ isTrusted: true, ...nullProps }, nullProps);
    expect(wrapper.state('imageUrls')).toBeUndefined();
  });

});

describe('render', () => {
  test('renders image not available', () => {
    const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
    expect(findByTestAttr(wrapper, 'component-image-modal').length).toBe(1);
  });

  describe('renders image', () => {
    describe('modal trigger', () => {
      test('renders', () => {
        const wrapper = setup({ isTrusted: false, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-modal-trigger-image').length).toBe(2);
      });

      test('untrusted image props', () => {
        const wrapper = setup({ isTrusted: false, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-modal-trigger-image').at(0).prop('src')).toBe(wrapper.state('imageUrls').thumbnail);
      });

      test('untrusted image props', () => {
        const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-modal-trigger-image').at(0).prop('src')).toBe(wrapper.state('imageUrls').url);
      });
      
    });

    describe('modal not shown', () => {
      test('renders component', () => {
        const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-image').length).toBe(0);
      });
  
      test('renders header div', () => {
        const wrapper = setup({ isTrusted: true, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-modal-header').length).toBe(0);
      });
    });

    describe('modal is open', () => {
      test('renders component', () => {
        const wrapper = setup({ open: true, isTrusted: true, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-image').length).toBe(2);
      });
  
      test('renders header div', () => {
        const wrapper = setup({ open: true, isTrusted: true, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-modal-header').length).toBe(2);
      });
  
      test('label when image is untrusted 0', () => {
        const wrapper = setup({ open: true, isTrusted: false, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-image').at(0).prop('label')).not.toBeNull();
      });

      test('label when image is untrusted 1', () => {
        const wrapper = setup({ open: true, isTrusted: false, ...stateProps }, stateProps);
        expect(findByTestAttr(wrapper, 'component-image').at(1).prop('label')).not.toBeNull();
      });

    });
  });
});