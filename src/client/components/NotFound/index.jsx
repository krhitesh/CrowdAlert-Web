import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ staticContext = {} }) => {
  // eslint-disable-next-line no-param-reassign
  staticContext.notFound = true;
  return (
    <div className="ui message" style={{ maxWidth: '550px', margin: '0 auto', marginTop: '2em' }}>
      <div className="header">
        Ooops! Route not found
      </div>
      <p>Did you mean:</p>
      <ul className="list">
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/create/location">Report an incident in your area</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
      </ul>
    </div>
  );
};

NotFoundPage.propTypes = {
  staticContext: propTypes.shape({
    notFound: false,
  }),
};

NotFoundPage.defaultProps = {
  staticContext: {},
};

export default {
  component: NotFoundPage,
};
