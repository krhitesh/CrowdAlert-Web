/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { Item, Segment, Dimmer, Loader, Message, Divider, Button, Responsive } from 'semantic-ui-react';
import { userGetIncidents } from './actions';
import calcAge from '../../utils/time';
import getEventColor from '../../utils/eventcolors';
import getWidth from '../../utils/width';

class UserIncidents extends React.Component {
  componentDidMount() {
    this.props.fetchUserIncidents();
  }
  renderIncidents() {
    return this.props.incidents.map(incident => (
      <React.Fragment key={incident.key}>
        <Item>
          <Item.Image size="small" circular src={incident.static_map} />

          <Item.Content verticalAlign="middle">
            <Item.Header as={Link} to={`/view/${incident.key}`}>{incident.title}</Item.Header>
            <Item.Description>
              <p>{calcAge(incident.datetime)}</p>
              <p>{incident.formatted_address}</p>
              <p>{incident.description}</p>
              <Responsive fireOnMount getWidth={getWidth} minWidth={768}>
                <Link to={`/view/${incident.key}`}>
                  <Button style={{ float: 'right' }} color={getEventColor(incident.category)}>View incident</Button>
                </Link>
              </Responsive>
              <Responsive fireOnMount getWidth={getWidth} maxWidth={768}>
                <p style={{ textAlign: 'center' }}>
                  <Link to={`/view/${incident.key}`}>
                    <Button style={{ marginTop: '0.8em' }} color={getEventColor(incident.category)}>View incident</Button>
                  </Link>
                </p>
              </Responsive>
            </Item.Description>
          </Item.Content>
        </Item>
        <Divider />
      </React.Fragment>
    ));
  }
  render() {
    return (
      <Segment style={{ minHeight: '500px', padding: '2em' }}>
        <h2>Your Reported Incidents</h2>
        <br />
        {this.props.errors ?
          <Message negative data-test="jsx-error-block">
            <Message.Header>Unable to process request</Message.Header>
            <Message.Content data-test="jsx-error-msg">{this.props.message}</Message.Content>
          </Message>
        : null}
        <Item.Group>
          {this.renderIncidents()}
        </Item.Group>
        <Dimmer
          inverted
          active={this.props.isLoading}
          data-test="preview-dimmer"
        >
          <Loader inverted />
        </Dimmer>
      </Segment>
    );
  }
}

UserIncidents.propTypes = {
  isLoading: propTypes.bool.isRequired,
  errors: propTypes.bool.isRequired,
  message: propTypes.string,
  incidents: propTypes.array.isRequired,
  fetchUserIncidents: propTypes.func.isRequired,
};

UserIncidents.defaultProps = {
  message: null,
};

const mapStateToProps = (state) => {
  const {
    isLoading,
    errors,
    message,
    incidents,
  } = state.user.incidents;
  return {
    isLoading,
    errors,
    message,
    incidents,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchUserIncidents: userGetIncidents,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserIncidents);
