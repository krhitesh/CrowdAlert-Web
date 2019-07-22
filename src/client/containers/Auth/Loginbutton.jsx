import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const Loginbutton = props => (
  <div data-test="component-login-btn">
    {props.login ?
      <Button fluid secondary basic icon data-test="btn-login">
        <Icon name="sign in" />
        Login
      </Button>
    : null }
    {props.signup ?
      <Button fluid primary icon data-test="btn-signup">
        <Icon name="signup" />
        Signup
      </Button>
    : null }
  </div>
);

Loginbutton.propTypes = {
  login: PropTypes.bool,
  signup: PropTypes.bool,
};
Loginbutton.defaultProps = {
  login: false,
  signup: false,
};

export default Loginbutton;
