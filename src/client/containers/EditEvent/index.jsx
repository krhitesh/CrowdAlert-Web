import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { fetchEventData } from '../Viewevent/actions';
import { updateMapPolyline } from '../../components/Map/actions';
import MapTab from './mapstab';
import FormTab from './formtab';
import ImageTab from './imagestab';
import requireAuth from '../../hocs/requireAuth';

class EditEvent extends React.Component {
  componentDidMount() {
    this.props.fetchEventData({ eventid: this.props.match.params.eventid });
    this.props.updateMapPolyline({
      polyline: null,
      bounds: null,
      fitBounds: false,
      isVisible: false,
      force: true,
    });
  }

  componentWillUnmount() {
    this.props.updateMapPolyline({
      polyline: null,
      bounds: null,
      fitBounds: false,
      isVisible: false,
      force: false,
    });
  }
  render() {
    return (
      <Container style={{ paddingBottom: '16vh' }} data-test="component-edit-event">
        <br />
        <Switch>
          <Route path={`${this.props.match.path}/location`} component={() => <MapTab eventid={this.props.match.params.eventid} />} data-test="maptab-route" />
          <Route path={`${this.props.match.path}/details`} component={() => <FormTab eventid={this.props.match.params.eventid} />} data-test="formtab-route" />
          <Route path={`${this.props.match.path}/images`} component={() => <ImageTab eventid={this.props.match.params.eventid} />} data-test="imagetab-route" />
          <Route render={() => (<Redirect to={`${this.props.match.path}/location`} />)} />
        </Switch>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  tabs: state.editEvents.tabs,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchEventData,
    updateMapPolyline,
  }, dispatch)
);

EditEvent.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    isExact: PropTypes.bool,
    params: PropTypes.object,
    url: PropTypes.string,
  }).isRequired,
  fetchEventData: PropTypes.func.isRequired,
  updateMapPolyline: PropTypes.func.isRequired,
};

export default {
  component: withRouter(connect(mapStateToProps, mapDispatchToProps)(requireAuth(EditEvent))),
  pureComponent: connect(mapStateToProps)(EditEvent),
};
