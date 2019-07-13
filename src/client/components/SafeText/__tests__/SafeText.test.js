import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import SafeText from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const getState = (props) => {
  let visible = true;
  let userFlagged = false;
  let toxic = false;
  const { spam } = props;

  if (spam.count && spam.count > 2) {
    visible = false;
    userFlagged = true;
  }
  if (spam.toxic && spam.toxic.toxic > 0.9) {
    visible = false;
    toxic = true;
  }
  return {
    visible,
    userFlagged,
    toxic,
    spam: props.spam,
  };
};

const setup = (props = {}) => mount(<SafeText {...props} />);

test('does not throw warning with expected props', () => {
  const expectedProps = {
    spam: {
      count: Math.floor(Math.random()*2),
      toxic: Math.random(),
      errors: false,
      message: null,
      modal: {
        open: true,
      }
    },
    children: <React.Fragment />
  };

  checkProps(SafeText, expectedProps);
});

describe('render', () => {
  let state;
  let wrapper;
  beforeEach(() => {
    const props = {
      spam: {
        count: Math.floor(Math.random()*2),
        toxic: Math.random(),
        errors: false,
        message: null,
        modal: {
          open: true,
        }
      },
      children: <React.Fragment />
    };
    wrapper = setup(props);
    state = getState(props);
  });

  test('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-safe-text').length).toBe(1);
  });

  test('a visible', () => {
    if (state.visible) {
      expect(findByTestAttr(wrapper, 'jsx-a').length).toBe(0);
    } else {
      expect(findByTestAttr(wrapper, 'jsx-a').length).toBe(1);
    }
  });
});

test('state', () => {
  const props = {
    spam: {
      count: Math.floor(Math.random()*2),
      toxic: Math.random(),
      errors: false,
      message: null,
      modal: {
        open: true,
      }
    },
    children: <React.Fragment />
  };
  const wrapper = setup(props);

  const state = getState(props);

  expect(wrapper.state()).toEqual(state);
});
