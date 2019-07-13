import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ staticContext = {} }) => {
  // eslint-disable-next-line no-param-reassign
  staticContext.notFound = true;
  return (
    <div className="ui message" style={{ maxWidth: '550px', margin: '0 auto', marginTop: '2em' }} data-test="component-not-found">
      <div className="header" data-test="jsx-header">
        Ooops! Route not found
      </div>
      <p>Did you mean:</p>
      <ul className="list" data-test="jsx-link-list">
        <li><Link to="/" data-test="link-feed">Feed</Link></li>
        <li><Link to="/create/location" data-test="link-create-location">Report an incident in your area</Link></li>
        <li><Link to="/login" data-test="link-login">Login</Link></li>
        <li><Link to="/signup" data-test="link-signup">Sign Up</Link></li>
        <li><Link to="/notifications" data-test="link-notifications">Notifications</Link></li>
      </ul>
    </div>
  );
};

NotFoundPage.propTypes = {
  staticContext: propTypes.shape({
    notFound: propTypes.bool,
  }),
};

NotFoundPage.defaultProps = {
  staticContext: {},
};

export default {
  component: NotFoundPage,
};
