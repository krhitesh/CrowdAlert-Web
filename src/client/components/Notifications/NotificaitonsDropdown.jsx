import React from 'react';
import { Dropdown, Segment, Header } from 'semantic-ui-react';
import { NotificationIcon, NotificationsContainer } from './';

const NotificaitonsDropdown = () => (
  <Dropdown
    icon={null}
    trigger={
      <span>
        <NotificationIcon />
      </span>
    }
    scrolling
    data-test="component-notifications-dropdown"
  >
    <Dropdown.Menu>
      <Segment.Group>
        <Segment secondary basic data-test="component-notifications-dropdown-segment-header">
          <Header>
            <Header.Content>
              Notifications
            </Header.Content>
          </Header>
        </Segment>
        <Segment data-test="component-notifications-dropdown-segment-notifications-container">
          <NotificationsContainer />
        </Segment>
      </Segment.Group>
    </Dropdown.Menu>
  </Dropdown>
);


export default NotificaitonsDropdown;
