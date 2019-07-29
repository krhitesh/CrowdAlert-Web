import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../client/tests/testUtils';
import Client from './index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

test('renders without error', () => {
  const wrapper = shallow(<Client.Component />);
  expect(findByTestAttr(wrapper, 'component-client')).toHaveLength(1);
});
