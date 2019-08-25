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
  >
    <Header icon>
      <Icon name={props.modal.icon} />
      {props.modal.header}
    </Header>
    <Modal.Content>
      <center>
        {props.modal.text}
      </center>
    </Modal.Content>
    <Modal.Actions>
      {props.permission === false ? null :
      <Button color="green" inverted onClick={props.showNotificationPermissionAsk}>
        <Icon name="checkmark" /> Allow
      </Button>
      }

      <Button color="red" inverted basic onClick={props.showNotificationPermissionClose}>
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
