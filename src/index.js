/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import { gzip } from 'zlib';
import { matchRoutes } from 'react-router-config';
import { getCookie } from './utils/cookie';
import { performAuthentication, handleNoUser } from './helpers/auth';
import Routes from './client/Routes';
import { renderApp, renderStatus } from './helpers/renderer';
import history from './helpers/history';
import serverConfigureStore from './helpers/serverConfigureStore';
import { DOMAIN_NAME_TO_PROXY, WS_NAME_TO_PROXY } from './client/utils/apipaths';

const app = express();

app.use(
  '/ws/*',
  proxy({ target: WS_NAME_TO_PROXY, changeOrigin: true, ws: true }),
);

app.use(
  '/api/*',
  proxy({ target: DOMAIN_NAME_TO_PROXY, changeOrigin: true }),
);

app.use(
  '/static/*',
  proxy({ target: DOMAIN_NAME_TO_PROXY, changeOrigin: true }),
);

app.use('*.js', (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.url += '.br';
    res.set('Content-Encoding', 'br');
  }
  res.set('Content-Type', 'text/javascript');
  next();
});

app.use(express.static('public'));
app.get('*', async (req, res) => {
  const cookie = req.get('cookie') || '';
  const token = getCookie(cookie, 'token');

  const store = serverConfigureStore(req, {}, history);
  if (token && token !== '') {
    await performAuthentication(store, token);
  } else {
    handleNoUser(store);
  }

  const promises = matchRoutes(Routes, req.path).map(({ route, match }) => {
    if (route.loadData) {
      if (route.component.displayName === `Connect(${Feed.component.WrappedComponent.name})`) {
        return route.loadData(
          store,
          req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        );
      } else if (route.component.displayName === `Connect(${Viewevent.component.WrappedComponent.name})`) {
        return route.loadData(
          store,
          match,
        );
      }

  Promise.all(promises)
    .then(() => {
      // Now is the time to render the application
      const context = {};
      const content = renderer(req, store, context);

      if (context.url) {
        return res.redirect(301, context.url);
      }
      if (context.notFound) {
        res.status(404);
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
          res.send(content);
        } else {
          res.set('Content-Encoding', 'gzip');
          res.set('Content-Type', 'text/html');
          res.send(gzipped);
        }
      });
    });
});

app.listen(parseInt(process.env.PORT, 10), () => {
  console.log(`listening on port ${process.env.PORT}`);
});
