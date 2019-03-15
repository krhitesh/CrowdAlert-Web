import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import { checkUserAuthenticationStatus } from '../Auth/actions';
import { updateMapPolyline } from '../../components/Map/actions';

// import propTypes from 'prop-types';
import {
  Menu,
  Sidebar,
  BottomBar,
  SpamReport,
  Notifications,
} from '../../components';
import Viewevent from '../Viewevent';
import Feed from '../Feed';
import CreateEvent from '../CreateEvent';
import LoginPage from '../Auth/LoginPage';
import SignUpPage from '../Auth/SignUpPage';
import ConfirmEmail from '../Auth/confirmEmail';

const PrivateRoute = ({ component: Cmp, auth: Auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (Auth) {
        return (<Cmp {...props} />);
      }
      return (<Redirect to="/login/" />);
    }
  }
  />
);
/**
 * [App Main entry point of the App]
 * @extends Component
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    if (window.localStorage.getItem('shouldBeLoggedIn') === 'true') {
      this.props.checkUserAuthenticationStatus();
    }
  }
  render() {
    // console.log(this.state);
    return (
      <div>
        {this.props.authenticating ?
          <Dimmer active inverted>
            <Loader>Authenticating</Loader>
          </Dimmer>
        : null }
        <Sidebar>
          <div>
            <Menu />
          </div>
          <Route exact path="/view/:eventid" component={Viewevent} />
          <PrivateRoute path="/create" component={CreateEvent} auth={this.props.isLoggedIn} />
          <Route
            exact
            path="/"
            render={(props) => {
              if (!this.props.eventPreview.isOpen) {
                this.props.updateMapPolyline({
                  polyline: null,
                  bounds: null,
                  fitBounds: false,
                  isVisible: false,
                });
              }
              return <Feed {...props} />;
            }}
          />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/auth/confirmEmail" component={ConfirmEmail} />
          <Route exact path="/notifications" component={Notifications.NotificationsPage} />

        </Sidebar>
        <BottomBar />
        <SpamReport.SpamReportModal />
        <Notifications.NotificationsModal />
      </div>

    );
  }
}
const mapStateToProps = (state) => {
  const { isLoggedIn, authenticating } = state.auth;
  const { eventPreview } = state;
  return {
    isLoggedIn,
    authenticating,
    eventPreview,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    checkUserAuthenticationStatus,
    updateMapPolyline,
  }, dispatch)
);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
