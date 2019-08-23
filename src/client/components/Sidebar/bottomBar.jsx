import React from 'react';
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
      <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
        <Segment style={styleSheet.bottomBar}>
          {props.auth.isLoggedIn?
            <Grid columns="equal" inverted>
              <Grid.Row textAlign="center">
                <Grid.Column>
                  <Link to="/">
                    <Icon circular color="teal" name="map outline" />
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  <Link to="/create/">
                    <Icon circular inverted color="teal" name="camera" />
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  <Link to="/notifications">
                    <Notifications.NotificationIcon />
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          :
            <Grid columns="equal" inverted>
              <Grid.Row textAlign="center">
                <Grid.Column>
                  <Link to="/login/">
                    <LoginButton login />
                  </Link>
                </Grid.Column>
                <Grid.Column>
                  <Link to="/signup/">
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

export default connect(mapStateToProps)(BottomBar);
