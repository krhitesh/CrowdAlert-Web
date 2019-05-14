/* eslint-disable quotes */
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';

const app = express();

app.use(express.static('public'));

app.get('**', (req, res) => {
  // const content = renderToString(main);

  const html = ``;

  res.send(html);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
