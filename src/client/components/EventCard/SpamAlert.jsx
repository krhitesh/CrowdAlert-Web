import React from 'react';
import {
  Message,
  Icon,
} from 'semantic-ui-react';

const SpamAlert = () => (
  <div data-test="component-spamalert">
    <Message
      attached
      warning
      icon
    >
      <Icon name="bullhorn" />
      <Message.Content>
        <Message.Header>
          Potential spam alert
        </Message.Header>
        This incident report got flagged by several other users.
        Please make sure verify the authenticity of the incident beforehand.
        If you feel that this event is not genuine, flag the event by clicking
        on the <Icon name="flag" /> button below.
      </Message.Content>
    </Message>
  </div>
);

export default SpamAlert;
