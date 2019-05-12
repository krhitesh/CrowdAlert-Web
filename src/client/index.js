/* eslint-disable react/jsx-filename-extension */
/**
 * CrowdAlert
 * index.js: main entry point of the app
 * eslint is disabled as there are references to window & documnet object.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Using StaticRouter for SSR
// import { ConnectedRouter } from 'react-router-redux';
import { StaticRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';
import { messaging } from './utils/firebase';
import App from './containers/App';
import { receivedNewNotification } from './components/Notifications/actions';

/**
 * [initialState initial state for the App]
 * @type {Object}
 */
const initialState = {};
/**
 * [history instantiate a history object containing the browser history
 *  used to push & pop pages using react-router]
 * @type {[type]}
 */
const history = process.env.BROWSER ? createHistory() : {};
/**
 * [store contains the redux store for the app]
 * @type {[type]}
 */
const store = configureStore(initialState, history);
/**
 * Dispatch actions on message is received
 */
if (process.env.BROWSER) {
  messaging.onMessage((payload) => {
    console.log('Message new', payload);
    store.dispatch(receivedNewNotification(payload));
  });
}

const exportComponent = (
  <Provider store={store}>
    <StaticRouter context={{}}>
      <App />
    </StaticRouter>
  </Provider>
);

export const main = exportComponent;

// Export the index component
// export const Main = <ExportComponent />;

// No use of ReactDOM.render() on server
if (false) {
  /**
 * [ROOT_NODE is the document reference where the app should be mounted]
 * @type {[type]}
 */
  const ROOT_NODE = document.getElementById('root');
  // Render the app to the specified mount point
  ReactDOM.render(exportComponent, ROOT_NODE);

  console.log('ReactDOM.render(exportComponent, ROOT_NODE);');
}
/**
 * [registerServiceWorker register the service worker. Required for the PWA
 * behaviour]
 * @param  {none} function [description]
 * @return {none}          [description]
 */

// TODO: Need to run this on client-side
if (process.env.BROWSER) {
  registerServiceWorker();
}

/**
 * [Manages the initial loading spinner. Shows the spinner until document is
 * rendered. ]
 * @return {[none]} [description]
 */
(function () {

  if (!process.env.BROWSER) {
    return;
  }

  const delay = 500;
  const dimmer = document.querySelector('#docs-loading-dimmer');
  dimmer.style.pointerEvents = 'none';
  dimmer.style.transition = `opacity ${delay}ms linear`;

  function removeDimmer() {
    dimmer.style.opacity = '0';

    setTimeout(() => {
      const dimmer = document.querySelector('#docs-loading-dimmer');

      document.body.removeChild(dimmer);
      document.body.setAttribute('class', '');
      window.removeEventListener('load', removeDimmer);
      alert("Production Build: 11-Aug");
    }, delay);
  }
  
  window.addEventListener('load', removeDimmer);
}());
/**
 * export the browser history instance so that it could be imported later
 */
export default history;
