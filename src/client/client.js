/* eslint-disable react/jsx-filename-extension */
// Startup point for the client side application
/**
 * CrowdAlert
 * index.js: main entry point of the app
 * client.js: main entry point of client rendered application
 * eslint is disabled as there are references to window & documnet object.
 */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import history from '../helpers/history';
import registerServiceWorker from './registerServiceWorker';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

import client from './index';
import { messaging } from './utils/firebase';
import { receivedNewNotification } from './components/Notifications/actions';

/**
 * Dispatch actions on message is received
 */
messaging.onMessage((payload) => {
  // console.log('Message', payload);
  client.store.dispatch(receivedNewNotification(payload));
});

const removeDimmer = () => {
  const delay = 500;
  const dimmer = document.querySelector('#docs-loading-dimmer');
  dimmer.style.opacity = '0';
  setTimeout(() => {
    const dimmer = document.querySelector('#docs-loading-dimmer');

    document.body.removeChild(dimmer);
    document.body.setAttribute('class', '');
    // Uncomment the following line
    // window.alert('Production Build: 11-Aug');
  }, delay);
};

/**
 * [ROOT_NODE is the document reference where the app should be mounted]
 * @type {[type]}
 */
const ROOT_NODE = document.getElementById('root');

// Render the app to the specified mount point
ReactDOM.hydrate(
  <client.Component />,
  ROOT_NODE,
  // removeDimmer,
);
/**
 * [registerServiceWorker register the service worker. Required for the PWA
 * behaviour]
 * @param  {none} function [description]
 * @return {none}          [description]
 */
registerServiceWorker();
if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}

/**
 * [Manages the initial loading spinner. Shows the spinner until document is
 * rendered. ]
 * @return {[none]} [description]
 */
// (function () {
//   const delay = 500;
//   const dimmer = document.querySelector('#docs-loading-dimmer');
//   dimmer.style.pointerEvents = 'none';
//   dimmer.style.transition = `opacity ${delay}ms linear`;

//   function removeDimmer() {
//     dimmer.style.opacity = '0';

//     setTimeout(() => {
//       const dimmer = document.querySelector('#docs-loading-dimmer');

//       document.body.removeChild(dimmer);
//       document.body.setAttribute('class', '');
//       window.removeEventListener('load', removeDimmer);
//       alert("Production Build: 11-Aug");
//     }, delay);
//   }

//   window.addEventListener('load', removeDimmer);
// }());
/**
 * export the browser history instance so that it could be imported later
 */
export default history;
