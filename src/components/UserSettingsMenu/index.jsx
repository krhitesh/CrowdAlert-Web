import React, { Component } from 'react';
import { Dropdown, Image, Segment, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import userImage from './man-user.svg';
import { logoutUserAuthencation } from '../../containers/Auth/actions';

class UserSettingsMenu extends Component {
  signOut() {
    this.props.signOut();
  }
  render() {
    const { displayName, photoURL, email } = this.props.user;
    return (
      <Dropdown
        trigger={
          <span>
            <Image avatar src={photoURL || userImage} />
          </span>
        }
      >
        <Dropdown.Menu>
          <Segment secondary basic>
            <Header>
              <Image avatar src={photoURL || userImage} />
              <Header.Content>
                {displayName}
                <Header.Subheader>
                  {email}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Segment>
          <Dropdown.Item icon="settings" text="Settings" description="Review your account settings" />
          <Dropdown.Item icon="user" text="Your Profile" description="View your profile" />
          <Dropdown.Item icon="privacy" text="Privacy" description="Review our privacy policy" />
          <Dropdown.Item icon="tasks" text="Your Reports" description="Incidents reported by you" />
          <Dropdown.Divider />
          <Dropdown.Item icon="sign out" text="Sign out." onClick={() => this.signOut()} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

UserSettingsMenu.propTypes = {
  signOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return {
    isLoggedIn,
    user,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signOut: logoutUserAuthencation,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsMenu);
