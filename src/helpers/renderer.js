/* eslint-disable no-underscore-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-filename-extension */
import 'babel-polyfill';
import React from 'react';
import propTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import rootTemplate from './templates';
import Routes from '../client/Routes';
import SEO from '../client/components/SEO';
import { DOMAIN_NAME } from '../client/utils/apipaths';

const Status = ({ statusCode, message }) => {
  const style = { textAlign: 'center' };
  const title = `Error ${statusCode} - Sorry, something went wrong.`;
  return (
    <div className="ui message" style={{ maxWidth: '550px', margin: '0 auto', marginTop: '2em' }}>
      <SEO
        title={title}
        url={DOMAIN_NAME}
        description={message}
      />
      <div className="header" style={style}>
        {title}
      </div>
      <p style={style}>{message}</p>
      <p style={style}>We&apos;re working on getting this fixed as soon as we can.</p>
    </div>
  );
};

Status.propTypes = {
  statusCode: propTypes.number.isRequired,
  message: propTypes.string.isRequired,
};

const renderStatus = (statusCode, message = '') => {
  const css = new Set();
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

  const content = renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <Status statusCode={statusCode} message={message} />
    </StyleContext.Provider>);

  return rootTemplate(css, content);
};

const renderApp = (req, store, context) => {
  const css = new Set();
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

  const content = renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <Provider store={store}>
        <StaticRouter location={req.path} context={context}>
          <div>{renderRoutes(Routes)}</div>
        </StaticRouter>
      </Provider>
    </StyleContext.Provider>);

  return rootTemplate(css, content, store.getState(), true);
};

export {
  renderApp,
  renderStatus,
};
