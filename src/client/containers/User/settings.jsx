/* eslint-disable max-len */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Segment,
  Menu,
  Button,
  Image,
  List,
  Checkbox,
  Header,
  Modal,
  Dimmer,
  Loader,
  Message,
  Form,
} from 'semantic-ui-react';
import { HomeLocationModal } from '../../components/index';
import googleLogo from '../../googlel.png';
import fbl from '../../facebookl.png';
import passl from '../../passl.png';

import { deleteUser, updateUserCredentials, userGetInfo } from './actions';
import { showNotificationPermissionAsk, showNotificationPermissionGranted } from '../../components/Notifications/actions';

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'account',
      showHomeLocationModal: false,
      showDeleteModal: false,
      showEmailUpdateModal: false,
      showPasswordUpdateModal: false,
      showChangePassword: Object.keys(this.props.providerData).indexOf('password') !== -1,
      email: null,
      password: null,
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.toggleHLModal = this.toggleHLModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEmailUpdateModal = this.toggleEmailUpdateModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.togglePasswordUpdateModal = this.togglePasswordUpdateModal.bind(this);
  }

  componentDidMount() {
    if (this.props.homeLocation === {}) {
      this.props.userGetInfo({ key: 'home_location' });
    }
    // eslint-disable-next-line no-undef
    if (Notification.permission === 'granted') {
      this.props.showNotificationPermissionGranted();
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { value } = target;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  toggleHLModal() {
    this.setState({ showHomeLocationModal: !this.state.showHomeLocationModal });
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  toggleEmailUpdateModal() {
    this.setState({ showEmailUpdateModal: !this.state.showEmailUpdateModal });
  }

  togglePasswordUpdateModal() {
    this.setState({ showPasswordUpdateModal: !this.state.showPasswordUpdateModal });
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  renderLoader() {
    return (
      <Dimmer active={this.props.isLoading} inverted data-test="component-dimmer">
        <Loader data-test="component-loader" />
      </Dimmer>
    );
  }

  renderHomeLocationModal() {
    return (
      <HomeLocationModal
        open={this.state.showHomeLocationModal}
        handleButtonClick={this.toggleHLModal}
      />
    );
  }

  renderPasswordUpdateModal() {
    return (
      <Modal size="small" open={this.state.showPasswordUpdateModal}>
        <Modal.Header>Update your Password</Modal.Header>
        <Modal.Content>
          <p>You need to login again after updating your password.</p>
          <br />
          <Form.Field>
            <Form.Input
              placeholder="Enter your new password"
              name="password"
              type="password"
              autoComplete="off"
              value={this.state.password}
              onChange={this.handleInputChange}
              data-test="input-password"
            />
          </Form.Field>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.togglePasswordUpdateModal}>Cancel</Button>
          <Button
            positive
            onClick={() => {
              this.togglePasswordUpdateModal();
              this.props.updateUserCredentials(null, this.state.password);
            }}
          >
            Update
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderEmailUpdateModal() {
    return (
      <Modal size="small" open={this.state.showEmailUpdateModal}>
        <Modal.Header>Update your email</Modal.Header>
        <Modal.Content>
          <p>You need to login again after updating your email.</p>
          <br />
          <Form.Field>
            <Form.Input
              placeholder="Enter your new email"
              name="email"
              type="email"
              autoComplete="off"
              value={this.state.email}
              onChange={this.handleInputChange}
              data-test="input-email"
            />
          </Form.Field>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.toggleEmailUpdateModal}>Cancel</Button>
          <Button
            positive
            onClick={() => {
              this.toggleEmailUpdateModal();
              this.props.updateUserCredentials(this.state.email);
            }}
          >
            Update
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderDeleteModal() {
    return (
      <Modal
        open={this.state.showDeleteModal}
        basic
        size="small"
        closeOnDimmerClick
      >
        <Header icon="user circle" content="Delete Account Permanently" />
        <Modal.Content>
          <h3>Are you sure you want to delete your account? You cannot undo this action.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={this.toggleDeleteModal} inverted>
            CLOSE
          </Button>
          <Button
            onClick={() => {
            this.toggleDeleteModal();
            this.props.deleteUser();
          }}
            color="red"
            inverted
          >
            DELETE
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderMenu() {
    const { activeItem } = this.state;
    let locationBtnText = 'Add';
    let locationText = 'Your home location will be automatically opened on map.';
    if (this.props.homeLocation !== {}) {
      locationBtnText = 'Update';
      locationText = this.props.homeLocation.text;
    }

    if (activeItem === 'account') {
      return (
        <div style={{ maxWidth: '900px', right: 0, marginLeft: '18em' }}>
          <List divided verticalAlign="middle">
            <List.Item style={{ maxHeight: '4em' }}>
              <List.Content floated="right">
                <Button onClick={this.toggleEmailUpdateModal} primary>Change</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Registered Email</b></p>
                <p>{this.props.email}</p>
              </List.Content>
            </List.Item>
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Button onClick={this.toggleHLModal} primary>
                  &nbsp;&nbsp;&nbsp;&nbsp;{locationBtnText}&nbsp;&nbsp;&nbsp;
                </Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Home Location</b></p>
                <p style={{ maxWidth: '300px' }}>{locationText}</p>
              </List.Content>
            </List.Item>
            {this.state.showChangePassword &&
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Button onClick={this.togglePasswordUpdateModal} primary>Change</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Change Password</b></p>
                <p>Password must be at least 6 characters long.</p>
              </List.Content>
            </List.Item>}
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Button onClick={this.toggleDeleteModal} basic color="red">DELETE</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Delete Account</b></p>
                <p>This process is not reversible.</p>
              </List.Content>
            </List.Item>
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                {Object.keys(this.props.providerData).map((providerId) => {
                  if (providerId === 'google.com') {
                    return <Image key={providerId} avatar src={googleLogo} />;
                  } else if (providerId === 'password') {
                    return <Image key={providerId} avatar src={passl} />;
                  } else if (providerId === 'facebook.com') {
                    return <Image key={providerId} avatar src={fbl} />;
                  }
                  return null;
                })}
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Connected Accounts</b></p>
              </List.Content>
            </List.Item>
          </List>
        </div>
      );
    } else if (activeItem === 'notifications') {
      return (
        <div style={{ maxWidth: '900px', right: 0, marginLeft: '18em' }}>
          <List divided verticalAlign="middle">
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff' }}>
              <List.Content floated="right">
                {this.props.permission ?
                  <Checkbox toggle checked={this.props.permission} />
                :
                  <Checkbox onChange={this.props.requestNotificationsPermission} toggle defaultChecked={this.props.permission} />}
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Enable Notifications</b></p>
              </List.Content>
            </List.Item>
          </List>
        </div>
      );
    }
    return (
      <div
        style={{
          maxWidth: '900px',
          right: 0,
          marginLeft: '18em',
        }}
      >
        <List divided verticalAlign="middle">
          <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff' }}>
            <List.Content floated="right">
              <Checkbox toggle />
            </List.Content>
            <List.Content>
              <p style={{ marginBottom: 0 }}><b>Receive promotional emails</b></p>
            </List.Content>
          </List.Item>
        </List>
      </div>
    );
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Segment style={{ minHeight: '500px', padding: '2em' }}>
        <h2>Settings</h2>
        <br />
        {this.props.errors ?
          <Message negative data-test="jsx-error-block">
            <Message.Header>Unable to process request</Message.Header>
            <Message.Content data-test="jsx-error-msg">{this.props.message}</Message.Content>
          </Message>
        : null}
        <Menu secondary vertical style={{ float: 'left' }}>
          <Menu.Item
            name="account"
            active={activeItem === 'account'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="notifications"
            active={activeItem === 'notifications'}
            onClick={this.handleItemClick}
          />
          {/* <Menu.Item
            name="emails"
            active={activeItem === 'emails'}
            onClick={this.handleItemClick}
          /> */}
        </Menu>
        <br />
        {this.renderMenu()}
        {this.renderDeleteModal()}
        {this.renderLoader()}
        {this.renderEmailUpdateModal()}
        {this.renderPasswordUpdateModal()}
        {this.renderHomeLocationModal()}
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  const { permission } = state.notifications;
  const { homeLocation } = state.geoLocator;
  const { providerData } = user;
  const { isLoading, errors, message } = state.user;
  const modifiedProviderData = {};
  providerData.map((provider) => {
    modifiedProviderData[provider.providerId] = { email: provider.email };
  });
  return {
    email: user.email,
    providerData: modifiedProviderData,
    isLoading,
    errors,
    message,
    homeLocation,
    permission: !!permission,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    deleteUser,
    updateUserCredentials,
    userGetInfo,
    requestNotificationsPermission: showNotificationPermissionAsk,
    showNotificationPermissionGranted,
  }, dispatch)
);

UserSettings.propTypes = {
  userGetInfo: propTypes.func.isRequired,
  requestNotificationsPermission: propTypes.func.isRequired,
  deleteUser: propTypes.func.isRequired,
  updateUserCredentials: propTypes.func.isRequired,
  email: propTypes.string.isRequired,
  providerData: propTypes.object.isRequired,
  isLoading: propTypes.bool.isRequired,
  errors: propTypes.bool.isRequired,
  message: propTypes.string,
  homeLocation: propTypes.object.isRequired,
  permission: propTypes.bool.isRequired,
  showNotificationPermissionGranted: propTypes.func.isRequired,
};

UserSettings.defaultProps = {
  message: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
