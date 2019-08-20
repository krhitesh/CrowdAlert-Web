import React from 'react';
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
  >
    <Header icon>
      <Icon name={`${props.errors?"meh":"smile"}`} />

      {props.errors ?
      'We are unable to process your request'
      : 'Thank you for making crowdalert a better place' }
    </Header>
    <Modal.Content>
      <center>
        {props.message}

      </center>
    </Modal.Content>
    <Modal.Actions>
      <Button color="green" inverted onClick={props.reportSpamModalClose}>
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
export default connect(mapStateToProps, mapDispatchToProps)(SpamReportModal);
