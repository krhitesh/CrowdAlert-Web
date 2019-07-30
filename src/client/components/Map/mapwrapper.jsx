import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { updateMapCenter, updateMapZoom, updateOnClick, updateMapPolyline } from './actions';
import style from './styleBright2';

const currentLocationMarkerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAOvSURBVEhLtVZLTxNRFD6tFh8YBQVlozFGJVokakyUiGGhCUpKO9NOC2hdEJcmYNwbJCYSTPQ/YDQGNAH6mGokKbgwuPCxcKOIbxJhYRSh0Ham4zkXKrSdOx0e3mQyvbd37ne+8/jOtcBShitaBNY/e8BiKwWLWggWWAMp6yyA9hNU6xgcHv4K7e2ppRzJ3+vt2QJCoAY8ETe4w+dBlBvx3ZDx0JoQappbi9SCEN6PB1qWZ4D3bQF4QsfBHbqYA5QNnD0nI8SgE5oCJUsDJ5b5DjfzP3nCEz5mDtwR2IVu860KMBlH4K7gKWNwFs9VBE17heVAoEof/Ky8btVY6oXBg3H3ojdzhiifMAVMHqnuFcB+zwH7uurYu/qRYNpTjsDGBWxXb1He7EXAzciko/fDzZEfU8PJpBrXcCQVNY7zF7jeUeJjZWWcH77A0QVgSa7Jx3bv5WjzTFyZJDDemEmokwdbos2GZ3lCfmjTrHPgnhCJQ6YopOfIoBwPiyfVKQK8/2xMq7gypNkaZA3qg1oBviuvDrF1GrhvuhyN5DKnRBODFQAkg6RIHGAbui/N9MbDEQQLaFibuQ+uX+9+z8BnEsokfccl4wydARDR53oySIYg206MXZopFzRtCILfHfzOwO8ER29xWQthB4A7WMu1DLP103jsJR1Uie7VZZrF3t46xIA/T0y/Ztmu50kBdR/9LXGBsVQUNZWggwp8GFM9F2etrfXKDFhRUklWanrAUsSLjDlJRetYp+kMpkQyA0zh+PcN1bm+mPiIsdOIMdapQgdhspgCTjNWVVXhMhZliRif5CYXxujjeOwVAR8yG+OWQUb4y0TMIMYhF5ZTZPdCE89y+//KarosQFubFd3Nrbn13kgTKRKxoDo1quNrD94xtrO4n77ji1JkvlMZlRSyJhkkRaJDqU4PtA5qNsxeMoKy3Y5h6Ip+Y6DxhBJjssnTbFG+AMLTbXOSKUXKue6ez8rtzQP+WFz59S9ldX6gYv0uuzTgN9bq8LnMzihgwI1KCxkUY0hu9412kjhQV2L1qqbiOH9D68WSie5U11OWCSzJpdzsXmwQubAKFWlxP6Z5vnbIZJk0Wm/QxYyn22Yud8YewxIyGkKgOl+88/XunP+Ffh/4nxTmv21KeDGjO9JKWVKZUu54o5vyg6Z3uB7vXDGwRz5tHnDxTql7Azj7jiB7v+nYU52SLtT371geaMZXmgUaI3YgBtTE6aokhrz49rG2ykoRZZBCJD3fagbwL5VD99jWsRKgAAAAAElFTkSuQmCC';

const MapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    center={{
      lat: parseFloat(props.lat),
      lng: parseFloat(props.lng),
    }}
    defaultOptions={{
      styles: style,
    // these following 7 options turn certain controls off
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      rotateControl: false,
      fullscreenControl: false,
      minZoom: 4,
      maxZoom: 20,
    }}
    disableDefaultUI
    onClick={props.onClick}
    onZoomChanged={props.onZoomChanged}
    onCenterChanged={props.onCenterChanged}
    ref={props.onMapMounted}
    zoom={props.zoom}
  >
    { props.children }
    <Polyline visible={props.polyline.isVisible} path={props.polyline.data} />
    { props.polyline.isVisible && props.geoLocatorProps.locationHistory &&
      <Marker
        position={{
        lat: props.geoLocatorProps.locationHistory[0].lat,
        lng: props.geoLocatorProps.locationHistory[0].lng,
        }}
        labelStyle={{ padding: '24px' }}
        icon={{ url: currentLocationMarkerImage }}
        onDblClick={props.zoomOnCurrentLocationMarkerClicked}
      /> }
  </GoogleMap>
));
/**
 * [Map Just to make sure everythings is in scope]
 * @param {[type]} props [description]
 */

class MapWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boundsAlreadyFit: false,
    };
    this.onMapMounted = this.onMapMounted.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onCenterChanged = this.onCenterChanged.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.zoomOnCurrentLocationMarkerClicked = this.zoomOnCurrentLocationMarkerClicked.bind(this);
  }
  onMapMounted(mapRef) {
    this.setState({ mapRef });
  }
  /**
   * Called when the zoom level of map is changed. Dispatches the.
   * corresponding redux action
  */
  onZoomChanged() {
    const lat = this.state.mapRef.getCenter().lat();
    const lng = this.state.mapRef.getCenter().lng();
    const zoom = this.state.mapRef.getZoom();
    this.props.updateMapZoom({
      lat,
      lng,
      zoom,
      fetch: this.props.shouldFetch,
    });
  }
  /**
   * Called when user changes the map center i.e moves the map.
   * Dispatches the corresponding redux action.
   */
  onCenterChanged() {
    const lat = this.state.mapRef.getCenter().lat();
    const lng = this.state.mapRef.getCenter().lng();
    const zoom = this.state.mapRef.getZoom();
    this.props.updateMapCenter({
      lat,
      lng,
      zoom,
      fetch: this.props.shouldFetch,
    });
  }
  zoomOnCurrentLocationMarkerClicked() {
    const { lat, lng } = this.props.geoLocatorProps.locationHistory[0];
    this.props.updateMapZoom({
      lat,
      lng,
      zoom: Math.min(this.props.mapProps.zoom + 3, 16),
    });
    this.props.updateMapCenter({
      lat,
      lng,
      zoom: Math.min(this.props.mapProps.zoom + 3, 16),
    });
  }
  fitPolylineBounds() {
    if (this.props.mapProps.polyline.fitBounds && !this.state.boundsAlreadyFit) {
      this.setState({
        boundsAlreadyFit: true,
      }, () => {
        this.state.mapRef.fitBounds(this.props.mapProps.polyline.bounds);
        this.props.updateMapPolyline({
          data: this.props.mapProps.polyline.data,
          isVisible: this.props.mapProps.polyline.isVisible,
          bounds: this.props.mapProps.polyline.bounds,
          fitBounds: false,
        });
        this.setState({
          boundsAlreadyFit: false,
        });
      });
    }
  }
  /**
   * Dispatches the map clicked incident if required
   * @param {*} e: Google Maps click event
   */
  handleOnClick(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    if (this.props.dispatchOnClick) {
      this.props.updateOnClick(lat, lng);
    }
  }
  render() {
    if (this.props.mapProps.polyline.isVisible) {
      this.fitPolylineBounds();
    }
    // console.log(this.props.geoLocatorProps, this.props.mapProps);
    return (
      <MapComponent
        lat={this.props.mapProps.lat}
        lng={this.props.mapProps.lng}
        polyline={this.props.mapProps.polyline}
        onMapMounted={this.onMapMounted}
        onZoomChanged={this.onZoomChanged}
        zoom={this.props.mapProps.zoom}
        zoomOnCurrentLocationMarkerClicked={this.zoomOnCurrentLocationMarkerClicked}
        onCenterChanged={this.onCenterChanged}
        onClick={this.handleOnClick}
        geoLocatorProps={this.props.geoLocatorProps}
        {...this.props}
      />
    );
  }
}
MapWrapper.propTypes = {
  updateMapZoom: PropTypes.func,
  updateMapCenter: PropTypes.func,
  updateOnClick: PropTypes.func,
  shouldFetch: PropTypes.bool,
  dispatchOnClick: PropTypes.bool,
  mapProps: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    polyline: PropTypes.shape({
      fitBounds: PropTypes.bool,
      bounds: PropTypes.object,
      data: PropTypes.array,
      isVisible: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  geoLocatorProps: PropTypes.shape({
    locationHistory: PropTypes.array,
  }).isRequired,
  updateMapPolyline: PropTypes.func,
};
MapWrapper.defaultProps = {
  updateMapZoom: () => {},
  updateMapCenter: () => {},
  updateOnClick: () => {},
  updateMapPolyline: () => {},
  shouldFetch: false,
  dispatchOnClick: false,
};

const mapStateToProps = state => ({
  mapProps: state.map,
  geoLocatorProps: state.geoLocator,
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateMapCenter,
    updateMapZoom,
    updateOnClick,
    updateMapPolyline,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);
