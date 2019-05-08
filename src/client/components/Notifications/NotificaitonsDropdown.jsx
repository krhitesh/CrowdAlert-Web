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
  >
    <Dropdown.Menu>
      <Segment.Group>
        <Segment secondary basic>
          <Header>
            <Header.Content>
              Notifications
            </Header.Content>
          </Header>
        </Segment>
        <Segment>
          <NotificationsContainer />
        </Segment>
      </Segment.Group>
    </Dropdown.Menu>
  </Dropdown>
);


export default NotificaitonsDropdown;
