/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import { gzip } from 'zlib';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';

const app = express();
app.use('*.js', (req, res, next) => {
  req.url += '.br';
  res.set('Content-Encoding', 'br');
  res.set('Content-Type', 'text/javascript');
  next();
});

app.use(express.static('public'));
app.get('*', async (req, res) => {
  // Use firebase Admin SDK on server to verify
  // the retrieved ID token. If that ID token is
  // valid, fetch the user then dispatch appropriate
  // redux action with that user data.


  // UserAuth(TODO) -> Dispatch apt action to inform redux (and state) that hey,
  // "this" is the auth status of the user who requested the application.
  // Then use the new state to render the application.

  // console.log(matchRoutes(Routes, req.path));
  const promises = matchRoutes(Routes, req.path).map(({ route, match }) => {
    // Crank up loadData function from all the 'to be' rendered here and 
    // return all the dispatches
    // as promises, when completed will allow us to render the application
    // on server
  });

  Promise.all(promises)
    .then(() => {
      // Now is the time to render the application

      const content = `<div>Server rendered HTML will come here</div>`;

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

app.listen(3000, () => {
  console.log('listening on port 3000');
});
