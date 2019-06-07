import React from 'react';
import { Responsive, Menu, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebarVisibility } from '../Sidebar/actions';
import LoginButton from '../../containers/Auth/Loginbutton';
import { UserSettingsMenu, Notifications } from '../';
import logo from '../../logo.png';
import getWidth from '../../utils/width';

const isBrowser = () => typeof window !== 'undefined';
const getWidth = () => {
  if (isBrowser()) return window.innerWidth;
  return Infinity;
};

/**
 * [MenuBar top menu bar for the app. Responsive according to the viewport]
 * @param {[type]} props [description]
 */
const MenuBar = props => (
  <Menu size="small">
    <Menu.Menu position="left">
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} {...Responsive.onlyMobile}>
        <Icon
          name="content"
          onClick={() => props.toggleSidebarVisibility({
            animation: 'scale down',
          })}
        />
      </Responsive>
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} {...Responsive.onlyTablet}>
        <Menu.Item>
          <Icon
            name="content"
            onClick={() => props.toggleSidebarVisibility({
              animation: 'uncover',
            })}
          />
        </Menu.Item>
      </Responsive>
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} minWidth={992}>
        <Image src={logo} style={{ height: '4vh' }} />
        <Link to="/">
          <Menu.Item>
            <Icon name="browser" />
            Feed
          </Menu.Item>
        </Link>
        <Link to="/create" data-test="link-create">
          <Menu.Item data-test="component-link-create">
            <Icon name="browser" />
            Report
          </Menu.Item>
        </Link>
      </Responsive>
    </Menu.Menu>
    <Menu.Menu position="right">
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} minWidth={992}>
        {props.isLoggedIn ?
          <Notifications.NotificationsDropdown data-test="component-notifications-dropdown" />
          :
          <Link to="/login" data-test="link-login">
            <LoginButton login data-test="component-link-login" />
          </Link>
        }
      </Responsive>
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} minWidth={992}>
        {props.isLoggedIn ?
          <UserSettingsMenu data-test="component-user-settings-menu" />
          :
          <Link to="/signup" data-test="link-signup">
            <LoginButton signup data-test="component-link-signup" />
          </Link>
        }
      </Responsive>
      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} {...Responsive.onlyTablet}>
        {props.isLoggedIn ?
          <Notifications.NotificationsDropdown data-test="component-notifications-dropdown" />
          :
          <Link to="/login" data-test="link-login">
            <LoginButton login data-test="component-link-login" />
          </Link>
        }
      </Responsive>

      <Responsive fireOnMount getWidth={getWidth} as={Menu.Item} {...Responsive.onlyMobile}>
        <Link to="/notifications" style={{ marginRight: '1em' }}>
          <Notifications.NotificationIcon />
        </Link>
        <Icon name="search" circular />
      </Responsive>
    </Menu.Menu>
  </Menu>
);

MenuBar.propTypes = {
  toggleSidebarVisibility: propTypes.func.isRequired,
  isLoggedIn: propTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { isLoggedIn } = state.auth;
  return {
    isLoggedIn,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleSidebarVisibility,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
