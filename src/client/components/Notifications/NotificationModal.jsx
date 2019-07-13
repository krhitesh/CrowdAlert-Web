import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  showNotificationPermissionClose,
  showNotificationPermissionAsk,
} from './actions';

const NotificationsModal = props => (
  <Modal
    open={props.modal.open}
    basic
    data-test="component-notifications-modal"
  >
    <Header icon data-test="component-modal-header">
      <Icon name={props.modal.icon} data-test="component-header-icon" />
      {props.modal.header}
    </Header>
    <Modal.Content data-test="component-modal-content">
      <center data-test="jsx-modal-text">
        {props.modal.text}
      </center>
    </Modal.Content>
    <Modal.Actions data-test="component-modal-actions">
      {props.permission === false ? null :
      <Button color="green" inverted onClick={props.showNotificationPermissionAsk} data-test="component-allow-btn">
        <Icon name="checkmark" /> Allow
      </Button>
      }

      <Button color="red" inverted basic onClick={props.showNotificationPermissionClose} data-test="component-close-btn">
        <Icon name="close" /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);

const mapStateToProps = state => ({
  modal: state.notifications.modal,
  permission: state.notifications.permission,
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showNotificationPermissionClose,
    showNotificationPermissionAsk,
  }, dispatch)
);

NotificationsModal.propTypes = {
  modal: PropTypes.shape({
    open: PropTypes.bool,
    icon: PropTypes.string,
    header: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  permission: PropTypes.bool,
  showNotificationPermissionAsk: PropTypes.func.isRequired,
  showNotificationPermissionClose: PropTypes.func.isRequired,
};

NotificationsModal.defaultProps = {
  permission: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsModal);
