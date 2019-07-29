/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import Webcam from '../webcam';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  ...Webcam.defaultProps,
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<Webcam {...setupProps} />);
  return wrapper;
};

beforeAll(() => {
  global.navigator.mediaDevices = {
    getUserMedia: contraints => Promise.resolve(null),
    enumerateDevices: () => Promise.resolve([]),
  };
});

test('does not throw warning with expected props', () => {
  const expectedProps = {
    ...defaultProps,
    videoSource: '',
    audioSource: '',
    style: {},
  };

  checkProps(Webcam, expectedProps);
});

test('renders', () => {
  const wrapper = setup({
    videoSource: '',
    audioSource: '',
    style: {},
  });

  expect(findByTestAttr(wrapper, 'component-webcam')).toHaveLength(1);
});
