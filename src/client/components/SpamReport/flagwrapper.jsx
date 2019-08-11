import React from 'react';
import PropTypes from 'prop-types';
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
        data-test="component-flag-basic"
      >
        <Icon name="flag" fitted data-test="icon-flag" />
      </Button>
    );
  }
  return (
    <Button onClick={() => props.reportSpamStart(props.uuid)} data-test="component-flag-non-basic">
      <Icon color="black" name="flag" data-test="icon-flag" /> {props.showLabel && 'Flag'}
    </Button>
  );
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    reportSpamStart,
  }, dispatch)
);

Flag.propTypes = {
  basic: PropTypes.bool,
  reportSpamStart: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
};

Flag.defaultProps = {
  basic: false,
  showLabel: true,
};

export default connect(null, mapDispatchToProps)(Flag);
