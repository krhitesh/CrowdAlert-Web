const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('./client/index').IndexComponent;

const app = express();

app.get('/', (req, res) => {
  const content = renderToString(<App />);
  res.send(content);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
