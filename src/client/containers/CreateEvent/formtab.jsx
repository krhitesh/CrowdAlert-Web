import React from 'react';
import {
  Segment,
  Grid,
  Form,
  Message,
  TextArea,
  Icon,
  Input,
  Header,
  Checkbox,
  Progress,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import getEventColor from '../../utils/eventcolors';
import getEventIcon from '../../utils/eventicon';
import { DOMAIN_NAME } from '../../utils/apipaths';
import SEO from '../../components/SEO';

import {
  updateEventDetailsCreateEvents,
  validateFormCreateEvents,
  changeTabCreateEventsForm,
} from './actions';

const eventOptions = [
  { key: 'el', text: 'Electric', value: 'electric' },
  { key: 'fr', text: 'Fire', value: 'fire' },
  { key: 'hl', text: 'Health', value: 'health' },
  { key: 'rd', text: 'Road', value: 'road' },
  { key: 'nt', text: 'Nature', value: 'nature' },
];

const head = () => (
  <SEO
    title="Add Incident Details | Report Incident"
    url={`${DOMAIN_NAME}/create/details`}
    description="Report an incident near you."
  />
);

const FormTab = (props) => {
  if (props.reportForm.isFreezed && !props.reportForm.loading) {
    return (<Redirect to="/create/images" data-test="redirect-images" />);
  }
  return (
    <Segment>
      {head()}
      <Progress
        percent={66}
        attached="top"
        color={getEventColor(props.details.eventType)}
      />
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" dividing>
              <Icon name="info" />
              <Header.Content>
                Incident Information
                <Header.Subheader>
                  We need to gather some information about the incident
                </Header.Subheader>
                <Header.Subheader>
                  <br />
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form loading={props.reportForm.loading}>
              <Form.Field>
                {props.reportForm.validationErrors ?
                  <Message
                    negative
                    icon="ban"
                    header={props.reportForm.message.header}
                    content={props.reportForm.message.body}
                    data-test="form-validation-error"
                  />
                : null }
                <Header as="h4">
                  <Icon name="marker" />
                  <Header.Content>
                    Incident Location
                    <Header.Subheader data-test="location-text">
                      {props.location.text}
                    </Header.Subheader>
                    <Header.Subheader>
                      <Link to="/create/location" data-test="link-change">Change</Link>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Form.Field>

              <Form.Field required disabled={props.reportForm.isFreezed}>
                <Header as="h4">
                  <Icon
                    color={getEventColor(props.details.eventType)}
                    name={getEventIcon(props.details.eventType)}
                  />
                  <Header.Content style={{ width: '100%' }}>
                    Incident Type
                    <Header.Subheader>
                      <br />
                    </Header.Subheader>
                    <Header.Subheader>
                      <Form.Select
                        options={eventOptions}
                        placeholder="Event Type"
                        value={props.details.eventType}
                        onChange={(e, { value }) =>
                          props.handleInputChange({
                            target: {
                              value,
                              name: 'eventType',
                            },
                          })
                        }
                        data-test="select-event-type"
                      />
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Form.Field>
              <Form.Field required disabled={props.reportForm.isFreezed}>
                <Header as="h4">
                  <Icon name="edit" />
                  <Header.Content style={{ width: '100%' }}>
                    Short Description
                    <Header.Subheader>
                      <br />
                    </Header.Subheader>
                    <Header.Subheader>
                      <Input
                        name="title"
                        label={{
                          basic: true,
                          content:
                          `${50 - parseInt(props.details.title.length, 10)}`,
                        }}
                        labelPosition="right"
                        onChange={props.handleInputChange}
                        value={props.details.title}
                        autoComplete="off"
                        maxLength={50}
                        data-test="input-title"
                      />
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Form.Field>

              <Form.Field disabled={props.reportForm.isFreezed} data-test="field-event-desc">
                <TextArea
                  placeholder="Tell us more"
                  style={{ minHeight: 100 }}
                  onChange={props.handleInputChange}
                  value={props.details.description}
                  name="description"
                />
              </Form.Field>
              <Form.Field disabled={props.reportForm.isFreezed} data-test="cb-public-visibility">
                <Checkbox
                  label={{ children: 'Make incident publicly visible' }}
                  checked={props.details.public}
                  onChange={() => props.handleInputChange({
                      target: {
                        checked: !props.details.public,
                        name: 'public',
                        type: 'checkbox',
                      },
                    })}
                />
              </Form.Field>
              <Form.Field disabled={props.reportForm.isFreezed} data-test="cb-report-anonm">
                <Checkbox
                  label={{ children: 'Report incident anonymously' }}
                  checked={props.details.anonymous}
                  onChange={() => props.handleInputChange({
                      target: {
                        checked: !props.details.anonymous,
                        name: 'anonymous',
                        type: 'checkbox',
                      },
                    })}
                />
              </Form.Field>
              <Form.Field disabled={props.reportForm.isFreezed} data-test="cb-public-help">
                <Checkbox
                  label={{ children: 'Ask for public help' }}
                  checked={props.details.help}
                  name="help"
                  onChange={() => props.handleInputChange({
                      target: {
                        checked:
                         props.details.public
                          && !props.details.help,
                        name: 'help',
                        type: 'checkbox',
                      },
                    })}
                />
              </Form.Field>

              <Form.Button
                floated="right"
                color="orange"
                onClick={(e) => {
                  e.preventDefault();
                  props.handleSubmit();
                }
                }
                disabled={
                  props.reportForm.loading || props.reportForm.isFreezed
                  }
                labelPosition="left"
                icon
                data-test="btn-report-incident"
              >
                <Icon name="check" /> Report Incident
              </Form.Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

FormTab.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  details: PropTypes.shape({
    help: PropTypes.bool,
    public: PropTypes.bool,
    title: PropTypes.string,
    eventType: PropTypes.object,
    anonymous: PropTypes.bool,
    description: PropTypes.string,
  }).isRequired,
  reportForm: PropTypes.shape({
    loading: PropTypes.bool,
    isFreezed: PropTypes.bool,
    validationErrors: PropTypes.bool,
    message: PropTypes.shape({
      header: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  tabs: state.createEvents.tabs,
  location: state.createEvents.location,
  details: state.createEvents.details,
  reportForm: state.createEvents.form,
});

const mapDisptachToProps = dispatch => (
  bindActionCreators({
    handleInputChange: updateEventDetailsCreateEvents,
    handleSubmit: validateFormCreateEvents,
    handleTabChange: changeTabCreateEventsForm,
  }, dispatch)
);

export default connect(mapStateToProps, mapDisptachToProps)(FormTab);
