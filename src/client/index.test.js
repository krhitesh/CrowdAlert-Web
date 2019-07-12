import React from 'react';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import client from './index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

test('renders without error', () => {

});
