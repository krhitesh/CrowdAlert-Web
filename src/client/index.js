/* eslint-disable react/jsx-filename-extension */
// Startup point for the client side application
/**
 * CrowdAlert
 * index.js: main entry point of the app
 * eslint is disabled as there are references to window & documnet object.
 */

import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import Routes from './Routes';
import history from '../helpers/history';

import configureStore from './configureStore';

/**
 * [initialState initial state for the App]
 * @type {Object}
 */
const initialState = window.__INITIAL_STATE__;

delete window.__INITIAL_STATE__;

/**
 * [store contains the redux store for the app]
 * @type {[type]}
 */
const store = configureStore(initialState, history);

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const Client = () => (
  <StyleContext.Provider value={{ insertCss }} data-test="component-client">
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>{renderRoutes(Routes)}</div>
      </ConnectedRouter>
    </Provider>
  </StyleContext.Provider>
);

export default {
  Component: Client,
  store,
};
