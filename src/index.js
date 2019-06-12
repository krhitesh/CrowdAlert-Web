/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import proxy from 'http-proxy-middleware';
import { gzip } from 'zlib';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import history from './helpers/history';
import serverConfigureStore from './helpers/serverConfigureStore';
import { domainName } from './client/utils/apipaths';

const app = express();
app.use('*.js', (req, res, next) => {
  req.url += '.br';
  res.set('Content-Encoding', 'br');
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
  // Use firebase Admin SDK on server to verify
  // the retrieved ID token. If that ID token is
  // valid, fetch the user then dispatch appropriate
  // redux action with that user data.
  const store = serverConfigureStore(req, {}, history);

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
      // Now is the time to render the application

      const content = renderer(req, store, {});

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
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
