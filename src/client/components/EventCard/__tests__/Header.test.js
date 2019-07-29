import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import Header from '../Header';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  reverse_geocode: { name: '', admin2: '', admin1: '' },
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => shallow(<Header {...defaultProps} {...props} />);
const randomReportedBy = () => {
  const reportedBy = {};
  const count = Math.floor(Math.random() * 20);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    reportedBy[`user-${i}`] = {
      displayName: `John Doe ${i}`,
      photoURL: 'https://assets2.razerzone.com/images/blade-15/logo-nvidia-geforce-rtx.png',
    };
  }
  return reportedBy;
};

describe('renders', () => {
  const props = {
    dateTime: new Date().getTime(),
    reportedBy: randomReportedBy(),
    ...defaultProps,
  };
  let wrapper;
  beforeEach(() => {
    wrapper = setup(props);
  });

  it('renders component', () => {
    expect(findByTestAttr(wrapper, 'component-header')).toHaveLength(1);
  });

  it('renders image component', () => {
    expect(findByTestAttr(wrapper, 'component-image')).toHaveLength(1);
  });

  it('renders feed date', () => {
    expect(findByTestAttr(wrapper, 'component-feed-date')).toHaveLength(1);
  });

  it('displays feed summary', () => {
    expect(findByTestAttr(wrapper, 'jsx-feed-summary-inner-p').text()).not.toBe(' reported an incident');
  });

  it('renders reverse geocode jsx', () => {
    expect(findByTestAttr(wrapper, 'jsx-rev-geocode')).toHaveLength(1);
  });
});

test('does not throw warning with expected props', () => {
  const expectedProps = {
    dateTime: new Date().getTime(),
    reportedBy: randomReportedBy(),
    ...defaultProps,
  };

  checkProps(Header, expectedProps);
});
