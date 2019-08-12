import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import Footer from '../Footer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  htmlInstructions: ['No directions available'],
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<Footer {...setupProps} />);
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup({ title: 'No title', uuid: 'uuid' });
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-footer')).toHaveLength(2);
  });

  it('renders directions modal without error', () => {
    expect(findByTestAttr(wrapper, 'component-directions-modal')).toHaveLength(2);
  });

  it('renders directions modal trigger without error', () => {
    expect(findByTestAttr(wrapper, 'modal-trigger')).toHaveLength(2);
  });

  it('renders upvote button without error', () => {
    expect(findByTestAttr(wrapper, 'component-upvote-btn')).toHaveLength(2);
  });

  it('renders share modal without error', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal')).toHaveLength(2);
  });

  it('renders share button without error', () => {
    expect(findByTestAttr(wrapper, 'jsx-btn-share')).toHaveLength(2);
  });

  it('renders spam report flag without error', () => {
    expect(findByTestAttr(wrapper, 'component-spamreport-flag')).toHaveLength(2);
  });
});

describe('props', () => {
  let wrapper;
  const props = {
    title: 'No title',
    uuid: 'uuid',
  };

  beforeEach(() => {
    wrapper = setup(props);
  });

  it('upvote button props', () => {
    expect(findByTestAttr(wrapper, 'component-upvote-btn').at(0).prop('uuid')).toEqual(props.uuid);
  });

  it('share modal uuid prop', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal').at(0).prop('uuid')).toEqual(props.uuid);
  });

  it('share modal title prop', () => {
    expect(findByTestAttr(wrapper, 'component-share-modal').at(0).prop('title')).toEqual(props.title);
  });

  it('spam report flag props', () => {
    expect(findByTestAttr(wrapper, 'component-spamreport-flag').at(0).prop('uuid')).toEqual(props.uuid);
  });
});

test('does not throw warning with expected props', () => {
  const expectedProps = { title: 'No title', uuid: 'uuid' };
  checkProps(Footer, expectedProps);
});
