import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Step,
  Icon,
  Responsive,
} from 'semantic-ui-react';
import getEventColor from '../../utils/eventcolors';
import getWidth from '../../utils/width';

import { changeTabCreateEventsForm } from './actions';

const Tabs = (props) => {
  return (
    <Step.Group fluid attached="top" widths={3} unstackable data-test="component-tabs">
      <Step
        completed={props.tabs.isValid.location}
        active={props.tabs.activeTab === 0}
        onClick={() => props.handleTabChange(0)}
        data-test="step-0"
      >
        <span data-test="step-0-content">
          <Icon circular color="yellow" name="map outline" size="small" />
          <Responsive fireOnMount getWidth={getWidth} minWidth={901}>
            <Step.Content>
              <Step.Title>Location</Step.Title>
              <Step.Description>{props.location.text}</Step.Description>
            </Step.Content>
          </Responsive>
        </span>

      </Step>
      <Step
        active={props.tabs.activeTab === 1}
        onClick={() => props.handleTabChange(1)}
        completed={props.tabs.isValid.details}
        data-test="step-1"
      >
        <Icon circular color={getEventColor(props.details.eventType)} name="edit" />
        <Responsive fireOnMount getWidth={getWidth} minWidth={901}>
          <Step.Content>
            <Step.Title>Description</Step.Title>
            <Step.Description>Enter incident information</Step.Description>
          </Step.Content>
        </Responsive>
      </Step>

      <Step
        active={props.tabs.activeTab === 2}
        onClick={() => props.handleTabChange(2)}
        completed={props.tabs.isValid.images}
        data-test="step-2"
      >
        <Icon circular color="brown" name="camera retro" />
        <Responsive fireOnMount getWidth={getWidth} minWidth={901}>
          <Step.Content>
            <Step.Title>Image</Step.Title>
            <Step.Description>Click a photo</Step.Description>
          </Step.Content>
        </Responsive>
      </Step>
    </Step.Group>
  );
};

const mapStateToProps = (state) => {
  return {
    tabs: state.createEvents.tabs,
    location: state.createEvents.location,
    details: state.createEvents.details,
  };
};

const mapDisptachToProps = dispatch => (
  bindActionCreators({
    handleTabChange: changeTabCreateEventsForm,
  }, dispatch)
);

Tabs.propTypes = {
  tabs: PropTypes.shape({
    isValid: PropTypes.shape({
      location: PropTypes.bool,
      details: PropTypes.bool,
      images: PropTypes.bool,
    }),
    activeTab: PropTypes.number,
  }).isRequired,
  handleTabChange: PropTypes.func.isRequired,
  location: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  details: PropTypes.shape({
    eventType: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps, mapDisptachToProps)(Tabs);
