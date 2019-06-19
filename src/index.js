/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import proxy from 'http-proxy-middleware';
import { gzip } from 'zlib';
import { matchRoutes } from 'react-router-config';
import { getCookie } from './utils/cookie';
import authenticateUser from './helpers/auth';
import Routes from './client/Routes';
import { renderApp, renderStatus } from './helpers/renderer';
import history from './helpers/history';
import serverConfigureStore from './helpers/serverConfigureStore';
import { domainName } from './client/utils/apipaths';

const app = express();
app.use('*.js', (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.url += '.br';
    res.set('Content-Encoding', 'br');
  }
  res.set('Content-Type', 'text/javascript');
  next();
});

app.use(
  '/api',
  proxy({ target: domainName, changeOrigin: true }),
);
app.use(
  '/static',
  proxy({ target: domainName, changeOrigin: true }),
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
  const authenticateUserPromise = authenticateUser(store, token);

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

  promises.push(authenticateUserPromise);

  let content = '';
  try {
    await Promise.all(promises);
    // Now is the time to render the application
    const context = {};
    content = renderApp(req, store, context);

    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) {
      res.status(404);
    }
  } catch (err) {
    let code = 500;
    if (err.code === 'ECONNREFUSED') {
      code = 404;
    }
    content = renderStatus(code, err.message);
    res.status(500);
  }

  gzip(content, (err, gzipped) => {
    if (err) {
      // Send the uncompressed content as it is
      res.set('Content-Type', 'text/html');
      res.send(content);
    } else {
      res.set('Content-Encoding', 'gzip');
      res.set('Content-Type', 'text/html');
      res.send(gzipped);
    }
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
