/* eslint-disable react/jsx-filename-extension */
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { Main } = require('./client/index');

const app = express();

app.use(express.static('public'));
app.get('**', (req, res) => {
  const content = renderToString(<Main />);
  res.send(content);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

