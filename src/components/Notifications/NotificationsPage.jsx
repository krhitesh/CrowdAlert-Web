import React from 'react';
import { Container, Header, Divider, Icon, Segment } from 'semantic-ui-react';
import { NotificationsContainer } from './';

const NotificationsPage = () => (
  <Container style={{ paddingTop: '1rem' }}>
    <Header as="h2">
      <Icon name="bell" />
      <Header.Content>
        Device Notifications
        <Header.Subheader>All your recent notifications</Header.Subheader>
      </Header.Content>
    </Header>
    <Divider />
    <Segment>
      <NotificationsContainer />
    </Segment>
  </Container>
);

export default NotificationsPage;
