import React from 'react';
import ReactDOM from 'react-dom';
import client from './index';

test('renders without error', () => {
  const div = document.createElement('div');
  ReactDOM.render(<client.Component />, div);
  ReactDOM.unmountComponentAtNode(div);
});
