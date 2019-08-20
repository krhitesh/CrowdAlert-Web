import React from 'react';
import {
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reportSpamStart } from './actions';

const Flag = (props) => {
  if (props.basic) {
    return (
      <Button
        as={Label}
        basic
        size="tiny"
        onClick={() => props.reportSpamStart(props.uuid)}
      >
        <Icon name="flag" fitted />
      </Button>
    );
  }
  return (
    <Button onClick={() => props.reportSpamStart(props.uuid)}>
      <Icon color="black" name="flag" /> Flag
    </Button>
  );
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    reportSpamStart,
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(Flag);
