import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import Header from '../Header';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  reverse_geocode: { name: '', admin2: '', admin1: '' },
  distance: null,
};

/**
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => shallow(<Header {...defaultProps} {...props} />);
const randomReportedBy = () => {
  const reportedBy = {};
  const count = Math.floor(Math.random()*20);
  for (let i = 0; i < count; i++) {
    reportedBy[`user-${i}`] = {
      displayName: `John Doe ${i}`,
      photoURL: `https://assets2.razerzone.com/images/blade-15/logo-nvidia-geforce-rtx.png`,
    }
  }
  return reportedBy;
};

describe('renders', () => {
  const props = {
    dateTime: new Date().getTime(),
    reportedBy: randomReportedBy(),
    ...defaultProps,
    distance: '1.6 km',
  };
  let wrapper;
  beforeEach(() => {
    wrapper = setup(props);
  });

  test('renders component', () => {
    expect(findByTestAttr(wrapper, 'component-header').length).toBe(1);
  });

  test('renders image component', () => {
    expect(findByTestAttr(wrapper, 'component-image').length).toBe(1);
  });

  test('renders feed date', () => {
    expect(findByTestAttr(wrapper, 'component-feed-date').length).toBe(1);
  });

  test('displays feed summary', () => {
    expect(findByTestAttr(wrapper, 'jsx-feed-summary-inner-p').text()).not.toBe(' reported an incident');
  });

  test('renders reverse geocode jsx', () => {
    expect(findByTestAttr(wrapper, 'jsx-rev-geocode').length).toBe(1);
  });

  it('renders distance jsx', () => {
    expect(findByTestAttr(wrapper, 'd-distance')).toHaveLength(1);
  });
});

test('does not throw warning with expected props', () => {
  const expectedProps = {
    dateTime: new Date().getTime(),
    reportedBy: randomReportedBy(),
    ...defaultProps
  };

  checkProps(Header, expectedProps);
});