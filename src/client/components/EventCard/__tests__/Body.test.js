import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Item, Label } from 'semantic-ui-react';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
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
      children: <React.Fragment />,
    };
    let wrapper;
    beforeEach(() => {
      wrapper = setup(props);
    });

    it('render', () => {
      expect(findByTestAttr(wrapper, 'component-body')).toHaveLength(1);
    });

    it('renders header', () => {
      expect(wrapper.find(Item.Header).render().text()).toEqual(props.title);
    });

    it('renders label', () => {
      expect(wrapper.find(Label).render().text())
        .toEqual(defaultProps.eventType.toUpperCase());
    });

    it('does not render desktop meta', () => {
      expect(findByTestAttr(wrapper, 'jsx-desktop')).toHaveLength(0);
    });
  });

  describe('renders on desktop without error', () => {
    const props = {
      title: '',
      desktop: true,
      spam: {},
      children: <React.Fragment />,
    };
    const wrapper = setup(props);

    it('renders desktop meta', () => {
      expect(findByTestAttr(wrapper, 'jsx-desktop')).toHaveLength(1);
    });
  });

  it('does not throw warning with expected props', () => {
    const expectedProps = {
      title: '',
      desktop: true,
      spam: {},
      children: <React.Fragment />,
    };

    checkProps(Body, expectedProps);
  });
});
