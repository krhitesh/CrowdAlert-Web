/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
  Segment,
  Menu,
  Button,
  Image,
  List,
  Checkbox,
} from 'semantic-ui-react';

export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: 'account' };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  renderMenu() {
    const { activeItem } = this.state;
    if (activeItem === 'account') {
      return (
        <div style={{ maxWidth: '900px', right: 0, marginLeft: '18em' }}>
          <List divided verticalAlign="middle">
            <List.Item style={{ maxHeight: '4em' }}>
              <List.Content floated="right">
                <Button primary>Change</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Registered Email</b></p>
                <p>hiteshkr@iitk.ac.in</p>
              </List.Content>
            </List.Item>
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Button primary>Change</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Change Password</b></p>
                <p>Password must be at least 6 characters long.</p>
              </List.Content>
            </List.Item>
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Button basic color="red">DELETE</Button>
              </List.Content>
              <List.Content>
                <p style={{ marginBottom: 0 }}><b>Delete Account</b></p>
                <p>This process is not reversible.</p>
              </List.Content>
            </List.Item>
            <List.Item style={{ maxHeight: '4em', borderTop: '#ffffff', marginTop: '2em' }}>
              <List.Content floated="right">
                <Image avatar src="https://react.semantic-ui.com/images/avatar/small/lena.png" />
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
                <Checkbox toggle />
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
      <div style={{ maxWidth: '900px', right: 0, marginLeft: '18em' }}>
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
          <Menu.Item
            name="emails"
            active={activeItem === 'emails'}
            onClick={this.handleItemClick}
          />
        </Menu>
        <br />
        {this.renderMenu()}
      </Segment>
    );
  }
}
