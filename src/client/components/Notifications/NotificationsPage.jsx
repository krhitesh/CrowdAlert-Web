import React from 'react';
import { Container, Header, Divider, Icon, Segment } from 'semantic-ui-react';
import { NotificationsContainer } from './';
import { domainName } from '../../utils/apipaths';
import SEO from '../SEO';

const head = () => (
  <SEO
    title="Notifications | CrowdAlert"
    url={`${domainName}/notifications`}
    description="Notifications."
  />
);

const NotificationsPage = () => (
  <Container style={{ paddingTop: '1rem' }}>
    {head()}
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

export default {
  component: NotificationsPage,
};
