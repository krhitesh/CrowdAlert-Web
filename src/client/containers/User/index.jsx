import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import requireAuth from '../../hocs/requireAuth';
import UserSettings from './settings';
import UserProfile from './profile';
import UserIncidents from './incidents';

const UserMenu = (props) => {
  const base = props.match.path;
  return (
    <Container style={{ paddingBottom: '16vh' }} data-test="component-user-menu">
      <br />
      <Switch>
        <Route path={`${base}/settings`} component={UserSettings} />
        <Route path={`${base}/profile`} component={UserProfile} />
        <Route path={`${base}/me/reports`} component={UserIncidents} />
      </Switch>
    </Container>
  );
};

UserMenu.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default {
  component: requireAuth(UserMenu),
};
