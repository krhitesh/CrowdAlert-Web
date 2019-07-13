import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import { Item, Label } from 'semantic-ui-react';
import Body from '../Body';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  desktop: false,
  description: 'None available',
  eventType: 'N/A',
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => shallow(<Body {...defaultProps} {...props} />);

describe('renders', () => {

  describe('renders without error', () => {
    const props = {
      title: 'No title',
      spam: {},
      children: <React.Fragment />
    };
    let wrapper;
    beforeEach(() => {
      wrapper = setup(props);
    });

    test('render', () => {
      expect(findByTestAttr(wrapper, 'component-body').length).toBe(1);
    });

    test('renders header', () => {
      expect(wrapper.find(Item.Header).render().text()).toEqual(props.title);
    });

    test('renders label', () => {
      expect(wrapper.find(Label).render().text()).toEqual(defaultProps.eventType.toUpperCase());
    });

    test('does not render desktop meta', () => {
      expect(findByTestAttr(wrapper, 'jsx-desktop').length).toBe(0);
    });

  });

  describe('renders on desktop without error', () => {
    const props = {
      title: '',
      desktop: true,
      spam: {},
      children: <React.Fragment />
    };
    const wrapper = setup(props);

    test('renders desktop meta', () => {
      expect(findByTestAttr(wrapper, 'jsx-desktop').length).toBe(1);
    });

  });

  test('does not throw warning with expected props', () => {
    const expectedProps = {
      title: '',
      desktop: true,
      spam: {},
      children: <React.Fragment />
    };

    checkProps(Body, expectedProps);
  });
});
