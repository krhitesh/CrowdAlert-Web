import React from 'react';
import propTypes from 'prop-types';
import {
  Sidebar,
  Menu,
  Icon,
  Image,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import logo from '../../logo.png';
import styles from './styles';
import { removeSidebarVisibility } from './actions';
import { logoutUserAuthencation } from '../../containers/Auth/actions';


/**
 * [LeftSidebar LeftSidebar for the app]
 * @param {[type]} props [description]
 */
const LeftSidebar = props => (
  <Sidebar.Pushable as="div" style={styles.fitContainer} data-test="component-left-sidebar">
    <Sidebar
      as={Menu}
      animation={props.animation}
      visible={props.isVisible}
      vertical
      inverted
      style={styles.sidebar}
    >
      <Menu.Item name="logo">
        <Image src={logo} size="small" bordered centered data-test="component-logo-image" />
      </Menu.Item>

      <Link to="/" onClick={props.removeSidebarVisibility} data-test="link-root">
        <Menu.Item name="home" data-test="link-root-content">
          <Icon name="home" />
          Home
        </Menu.Item>
      </Link>
      <Link to="/create" onClick={props.removeSidebarVisibility} data-test="link-create">
        <Menu.Item name="camera" data-test="link-create-content">
          <Icon name="camera" />
          Report
        </Menu.Item>
      </Link>
      {props.isLoggedIn ?
        <Menu.Item name="avatar" data-test="component-menu-item">
          <Image
            avatar
            src={props.user.photoURL}
            floated="right"
            style={{
 position: 'fixed', right: '0px', marginRight: '0.7rem', marginTop: '-0.5rem',
}}
          />
          {props.user.displayName}
          <Menu.Menu icon="labeled">
            <Menu.Item />
            <Menu.Item name="settings">
              <Icon name="settings" />
              Settings
            </Menu.Item>
            <Menu.Item name="add">
              <Icon name="user" />
              Your Profile
            </Menu.Item>
            <Menu.Item name="add">
              <Icon name="tasks" />
              Your Reports
            </Menu.Item>
            <Menu.Item name="add">
              <Icon name="privacy" />
              Privacy Policy
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      :
      null
      }
      {props.isLoggedIn ?
        <Menu.Item
          name="logout"
          onClick={() => {
            props.removeSidebarVisibility();
            props.signOut();
          }}
          data-test="component-menu-item-signout"
        >
          <Icon name="sign out" />
          Sign out
        </Menu.Item>
      :
        <div data-test="jsx-logged-out">
          <Link to="/login" onClick={props.removeSidebarVisibility} data-test="link-login">
            <Menu.Item name="logout" data-test="link-login-content">
              <Icon name="sign in" />
              Login
            </Menu.Item>
          </Link>
          <Link to="/signup" onClick={props.removeSidebarVisibility} data-test="link-signup">
            <Menu.Item name="logout" data-test="link-signup-content">
              <Icon name="signup" />
              Sign up
            </Menu.Item>
          </Link>
        </div>
      }
    </Sidebar>
    <Sidebar.Pusher
      onClick={props.isVisible ? props.removeSidebarVisibility : null}
      dimmed={!!(props.animation === 'scale down' && props.isVisible)}
      data-test="sidebar-pusher"
    >
      {props.children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);
LeftSidebar.propTypes = {
  /* function to handle the visiblity */
  removeSidebarVisibility: propTypes.func.isRequired,
  /* bool denoting whether the sidebar is open or not */
  isVisible: propTypes.bool.isRequired,
  animation: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
  isLoggedIn: propTypes.bool.isRequired,
  signOut: propTypes.func.isRequired,
  user: propTypes.shape({
    displayName: propTypes.string,
    photoURL: propTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return {
    ...state.sidebar,
    isLoggedIn,
    user,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signOut: logoutUserAuthencation,
    removeSidebarVisibility,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
