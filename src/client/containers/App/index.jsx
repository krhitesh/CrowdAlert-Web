import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import { checkUserAuthenticationStatus } from '../Auth/actions';

// import propTypes from 'prop-types';
import {
  Menu,
  Sidebar,
  BottomBar,
  SpamReport,
  Notifications,
} from '../../components';

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
    // if (window.localStorage.getItem('shouldBeLoggedIn') === "true") {
    //   this.props.checkUserAuthenticationStatus();
    // }
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
          {/* Moved all route to requireAuth and inside Routes */}
          {renderRoutes(this.props.route.routes)}

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
  return {
    isLoggedIn,
    authenticating,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    checkUserAuthenticationStatus,
  }, dispatch)
);
export default {
  component: withRouter(connect(mapStateToProps, mapDispatchToProps)(App)),
};
