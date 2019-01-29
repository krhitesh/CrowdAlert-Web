import React, { Component } from 'react';
import {
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  fetchUpvotesStart,
  fetchUpvotesCancel,
  updateUpvoteStart,
  updateUpvoteCancel,
} from './actions';

const UpvoteButton = (props) => {
  const { hasUpvoted } = props;
  return (
    <Button active={hasUpvoted} onClick={props.click}>
      {hasUpvoted ?
        <Icon color="red" name="thumbs up" fitted />
        :
        <Icon name="thumbs up outline" />
      }
      {props.count ? props.count : null}
    </Button>
  );
};

UpvoteButton.propTypes = {
  hasUpvoted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

const UpvoteButtonBasic = (props) => {
  const { hasUpvoted } = props;
  return (
    <Button
      as={Label}
      basic
      size="tiny"
      active={hasUpvoted}
      onClick={props.click}
    >
      {hasUpvoted ?
        <Icon color="red" name="like" />
        :
        <Icon color="grey" name="like" />
      }
      {props.count ?
        <Label.Detail>
          {props.count}
        </Label.Detail>
      : null}
    </Button>
  );
};

UpvoteButtonBasic.propTypes = {
  hasUpvoted: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  click: PropTypes.func.isRequired,
};

class Upvote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: null,
      hasUpvoted: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.props.fetchUpvotesStart(this.props.uuid);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps.upvotes,
    };
  }
  componentWillUnmount() {
    this.props.fetchUpvotesCancel();
    this.props.updateUpvoteCancel();
  }
  handleClick() {
    if (!window.sessionStorage.getItem('token')) {
      return;
    }
    this.props.updateUpvoteStart(this.props.uuid);
    if (this.state.hasUpvoted) {
      this.setState({
        hasUpvoted: false,
        count: this.state.count - 1,
      });
    } else {
      this.setState({
        hasUpvoted: true,
        count: this.state.count + 1,
      });
    }
  }
  render() {
    if (this.props.basic) {
      return (
        <UpvoteButtonBasic
          hasUpvoted={this.state.hasUpvoted}
          count={this.state.count}
          click={this.handleClick}
        />
      );
    }
    return (
      <UpvoteButton
        hasUpvoted={this.state.hasUpvoted}
        count={this.state.count}
        click={this.handleClick}
      />
    );
  }
}

Upvote.propTypes = {
  upvotes: PropTypes.object,
  fetchUpvotesStart: PropTypes.func.isRequired,
  fetchUpvotesCancel: PropTypes.func.isRequired,
  updateUpvoteStart: PropTypes.func.isRequired,
  updateUpvoteCancel: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.hasOwnProperty) {
    return {
      upvotes: state.upvotes.upvoteData[ownProps.uuid],
    };
  }
  return {
    upvotes: {
      uuid: '',
      hasUpvoted: false,
      count: 0,
    },
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchUpvotesStart,
    fetchUpvotesCancel,
    updateUpvoteStart,
    updateUpvoteCancel,
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(Upvote);
