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

import { reportSpamModalClose } from './actions';

const SpamReportModal = props => (
  <Modal
    open={props.modal.open}
    basic
    size="small"
    data-test="component-spamreportmodal"
  >
    <Header icon data-test="component-header">
      <Icon name={`${props.errors ? 'meh' : 'smile'}`} />

      {props.errors ?
      'We are unable to process your request'
      : 'Thank you for making crowdalert a better place' }
    </Header>
    <Modal.Content data-test="modal-content">
      <center>
        {props.message}

      </center>
    </Modal.Content>
    <Modal.Actions data-test="modal-actions">
      <Button color="green" inverted onClick={props.reportSpamModalClose} data-test="modal-action-btn">
        <Icon name="checkmark" /> Got it
      </Button>
    </Modal.Actions>
  </Modal>
);

const mapStateToProps = state => ({
  message: state.spam.message,
  modal: state.spam.modal,
  errors: state.spam.errors,
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    reportSpamModalClose,
  }, dispatch)
);

SpamReportModal.propTypes = {
  modal: PropTypes.shape({
    open: PropTypes.bool,
  }).isRequired,
  errors: PropTypes.bool,
  message: PropTypes.string,
  reportSpamModalClose: PropTypes.func.isRequired,
};

SpamReportModal.defaultProps = {
  errors: false,
  message: 'Empty message',
};

export default connect(mapStateToProps, mapDispatchToProps)(SpamReportModal);
