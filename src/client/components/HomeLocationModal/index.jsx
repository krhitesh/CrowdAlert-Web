/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Modal,
  Grid,
  Button,
  Header,
  Icon,
} from 'semantic-ui-react';
import {
  MapWrapper,
  Sonar,
  GeoLocator,
} from '../';
import { saveHomeLocation } from './actions';

const HomeLocationModal = (props) => {
  return (
    <Modal size="small" open={props.open} style={{ top: '10%', padding: '3em' }}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">
              <Icon name="marker" />
              <Header.Content>
                Home Location
                <Header.Subheader>
                  Click on the map to update home location
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
                dispatchOnClick
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
              fetchOnLoad
              floated="left"
              circular={false}
              size={null}
              zoom={16}
              data-test="geolocator"
            />
            <Button floated="right" color="red" onClick={props.handleButtonClick} inverted>
              CLOSE
            </Button>
            <Button
              positive
              floated="right"
              disabled={!props.location.mapCenter.lat}
              onClick={() => {
                props.handleButtonClick();
                /* Dispatch action to POST location. Use middleware to get the body */
                props.handleSaveLocation(
                  props.location.mapCenter.lat,
                  props.location.mapCenter.lng,
                  props.location.text,
                );
              }}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Modal>
  );
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    handleSaveLocation: saveHomeLocation,
  }, dispatch)
);
const mapStateToProps = state => ({
  location: state.homeLocation,
  map: state.map,
});

HomeLocationModal.propTypes = {
  location: PropTypes.shape({
    mapCenter: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }).isRequired,
    text: PropTypes.string,
    formatted_address: PropTypes.object.isRequired,
  }).isRequired,
  map: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
  handleSaveLocation: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeLocationModal);
