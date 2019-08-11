import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Segment,
  Grid,
  Button,
  Header,
  Icon,
  Progress,
  Message,
} from 'semantic-ui-react';
import {
  MapWrapper,
  Sonar,
  GeoLocator,
} from '../../components';
import { validateLocationEditEvents } from './actions';
import getEventColor from '../../utils/eventcolors';
import { DOMAIN_NAME } from '../../utils/apipaths';
import SEO from '../../components/SEO';


const MapTab = (props) => {
  return (
    <Segment data-test="component-mapstab">
      <SEO
        title="Update Location | Report Incident"
        url={`${DOMAIN_NAME}/edit/${props.eventid}/location`}
        description="Report an incident near you."
      />
      <Progress
        percent={33}
        attached="top"
        color={getEventColor(props.details.eventType)}
      />
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {props.location.validationErrors ?
              <Message
                negative
                icon="ban"
                header="Location Restricted"
                content="Reported incident must be within 3 KM of circular area."
                data-test="form-validation-error"
              />
            : null }
            <Header as="h3">
              <Icon name="marker" />
              <Header.Content>
                Location Information
                <Header.Subheader>
                  Click on the map to update the incident location
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div
              style={{
                width: '100%',
                height: '50vh',
                left: '0px',
              }}
            >
              <MapWrapper
                dispatchOnClick={!props.reportForm.isFreezed}
                shouldFetch={false}
                data-test="mapwrapper"
              >
                {props.location.mapCenter.lat ?
                  <Sonar
                    lat={props.location.mapCenter.lat || props.map.lat}
                    lng={props.location.mapCenter.lng || props.map.lng}
                    id={null}
                    data-test="location-sonar"
                  />
                : null }

              </MapWrapper>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">
              <Icon name="bullseye" />
              <Header.Content>
                Current Map Location
                <Header.Subheader>
                  {props.location.text || 'No location selected'}
                </Header.Subheader>
              </Header.Content>
            </Header>
            <GeoLocator
              static
              fetchOnLoad={!props.tabs.isValid.location}
              floated="left"
              circular={false}
              size={null}
              zoom={16}
              data-test="geolocator"
            />
            <Button
              floated="right"
              color="teal"
              disabled={!props.location.mapCenter.lat}
              onClick={() => props.validateSaveLocation()}
              icon
              labelPosition="right"
              data-test="details-btn"
            >
              <Icon name="right arrow" />
              Next
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    validateSaveLocation: validateLocationEditEvents,
  }, dispatch)
);
const mapStateToProps = state => ({
  tabs: state.editEvents.tabs,
  location: state.editEvents.location,
  details: state.editEvents.details,
  map: state.map,
  reportForm: state.editEvents.form,
});

MapTab.propTypes = {
  details: PropTypes.shape({
    eventType: PropTypes.string,
  }).isRequired,
  reportForm: PropTypes.shape({
    isFreezed: PropTypes.bool,
  }).isRequired,
  location: PropTypes.shape({
    mapCenter: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }).isRequired,
    text: PropTypes.string,
    validationErrors: PropTypes.bool,
  }).isRequired,
  map: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  tabs: PropTypes.shape({
    isValid: PropTypes.shape({
      location: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  validateSaveLocation: PropTypes.func.isRequired,
  eventid: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapTab);
