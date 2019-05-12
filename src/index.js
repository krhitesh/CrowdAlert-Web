/* eslint-disable react/jsx-filename-extension */
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { main } from './client/index';

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
  const content = renderToString(main);

  const html = `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <script>
        // Redirect to HTTPS
        if (location.hostname === 'crowdalert.herokuapp.com' && location.protocol !== 'https:') {
          location.href = location.href.replace('http:','https:')
        }
      </script>
  
  
      <!-- Semantic UI CSS -->   
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png">
      <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5">

      <!-- <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
      <link rel="shortcut icon" href="%PUBLIC_URL%/static/icons/favicon.ico"> -->
      <link rel="manifest" href="/manifest.json">
      <link rel="shortcut icon" href="/static/icons/favicon.ico">
  
      <meta name="msapplication-TileColor" content="#9f00a7">
      <meta name="msapplication-config" content="/static/icons/browserconfig.xml">
      <title>CrowdAlert</title>
    </head>
    <body class="dimmed dimmable" style="background: #f3f2f2">    
      <div class="ui active page dimmer" id="docs-loading-dimmer">
        <div class="content">
          <div class="center">         
            <div class="ui large text loader">
              <div class="ui inverted yellow header">
                Loading
              </div>
            </div>
          </div>
        </div>
      </div>
      <noscript>
        You need to enable JavaScript to run this app.
      </noscript>
      <style>
        .ui.menu .item:before {
            width: 0px;
        }
      </style>
      <div id="root">${content}</div>
      <script src="bundle.js"></script>
    </body>
  </html>
  
  `;

  res.send(html);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

