import React from 'react';
import PropTypes from 'prop-types';
import { Responsive, Segment, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styleSheet from './styles';
import LoginButton from '../../containers/Auth/Loginbutton';
import { Notifications } from '../';
import getWidth from '../../utils/width';

const BottomBar = (props) => {
  if (props.bottomBarIsVisible && typeof window !== 'undefined') {
    return (
      <Responsive fireOnMount getWidth={getWidth} maxWidth={900} data-test="component-bottombar">
        <Segment style={styleSheet.bottomBar}>
          {props.auth.isLoggedIn ?
            <Grid columns="equal" inverted data-test="component-logged-in-grid">
              <Grid.Row textAlign="center">
                <Grid.Column data-test="component-grid-map-outline">
                  <Link to="/" data-test="link-root">
                    <Icon circular color="teal" name="map outline" />
                  </Link>
                </Grid.Column>
                <Grid.Column data-test="component-grid-map-camera">
                  <Link to="/create/" data-test="link-create">
                    <Icon circular inverted color="teal" name="camera" />
                  </Link>
                </Grid.Column>
                <Grid.Column data-test="component-notifications">
                  <Link to="/notifications" data-test="link-notifications">
                    <Notifications.NotificationIcon />
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          :
            <Grid columns="equal" inverted data-test="component-logged-out-grid">
              <Grid.Row textAlign="center">
                <Grid.Column>
                  <Link to="/login/" data-test="link-login">
                    <LoginButton login />
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  <Link to="/signup/" data-test="link-signup">
                    <LoginButton signup />
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
        </Segment>
      </Responsive>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  ...state.sidebar,
  auth: state.auth,
});

BottomBar.propTypes = {
  bottomBarIsVisible: PropTypes.bool.isRequired,
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps)(BottomBar);
