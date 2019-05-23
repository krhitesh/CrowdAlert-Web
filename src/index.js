/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import proxy from 'http-proxy-middleware';
import { matchRoutes } from 'react-router-config';
import compression from 'compression';
import history from './helpers/history';
import { getCookie } from './utils';
import { performAuthentication, handleNoUser } from './helpers/auth';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import serverConfigureStore from './helpers/serverConfigureStore';

const app = express();
app.use(compression());

app.use(
  '/api',
  proxy({ target: 'http://localhost:8000', changeOrigin: true }),
);
app.use(
  '/static',
  proxy({ target: 'http://localhost:8000', changeOrigin: true }),
);

app.use(express.static('public'));
app.get('*', async (req, res) => {
  const cookie = req.get('cookie') || '';
  const token = getCookie(cookie, 'token');
  // Use firebase Admin SDK on server to verify
  // the retrieved ID token. If that ID token is
  // valid, fetch the user then dispatch appropriate
  // redux action with that user data.

  const store = serverConfigureStore(req, {}, history);
  if (token && token !== '') {
    await performAuthentication(store, token);
  } else {
    handleNoUser(store);
  }

  // UserAuth(TODO) -> Dispatch apt action to inform redux (and state) that hey,
  // "this" is the auth status of the user who requested the application.
  // Then use the new state to render the application.

  // console.log(matchRoutes(Routes, req.path));
  const promises = matchRoutes(Routes, req.path).map(({ route, match }) => {
    if (route.loadData) {
      if (route.component.displayName === 'Connect(Feed)') {
        return route.loadData(
          store,
          req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        );
      } else if (route.component.displayName === 'Connect(Viewevent)') {
        return route.loadData(
          store,
          match,
        );
      }

      return route.loadData(store);
    }

    return null;
  })
    .map((promise) => {
      if (promise) {
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(reject);
        });
      }
    });

  Promise.all(promises)
    .then(() => {
      const context = {};
      const content = renderer(req, store, context);

      if (context.url) {
        return res.redirect(301, context.url);
      }
      if (context.notFound) {
        res.status(404);
      }

      res.send(content);
    });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
