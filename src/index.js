/* eslint-disable quotes */
import express from 'express';
import renderer from './helpers/renderer';
import serverConfigureStore from './client/serverConfigureStore';

const app = express();

app.use(express.static('public'));

app.get('*', (req, res) => {
  const store = serverConfigureStore(req);
  const context = {};
  // Some logic to initialize data and
  // load data into the store.

  res.send(renderer(req, store, context));
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
