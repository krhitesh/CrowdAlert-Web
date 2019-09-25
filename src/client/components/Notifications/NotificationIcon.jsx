import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';


const NotificationIcon = (props) => {
  return (
    <div data-test="component-notification-icon">
      <Icon circular>
        <Icon.Group >
          <Icon name="bell" color="teal" />
          {props.unread ?
            <Icon corner name="circle" color="red" data-test="component-icon" />
          : null }
        </Icon.Group>
      </Icon>
    </div>
  );
};

const mapStateToProps = state => ({
  unread: state.notifications.unread,
});

NotificationIcon.propTypes = {
  unread: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(NotificationIcon);
