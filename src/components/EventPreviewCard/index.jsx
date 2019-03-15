import React from 'react';
import proptypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Responsive,
  Transition,
  Segment,
  Header,
  Icon,
  Button,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import style from './style';
import { closeEventPreview } from './actions';
import { updateMapPolyline } from '../Map/actions';
import calcAge from '../../utils/time';
import getEventColor from '../../utils/eventcolors';


const EventPreviewCard = (props) => {
  if (!props.eventPreview.event) {
    return null;
  }
  return (
    <div>
      <Responsive minWidth={900}>
        <div style={style.widescreen}>
          {/* Animation isn't working as it requires component to be mounted
            before visibility is set true. Probably we can achive that using
            a two-fold function call. First one mounts the component & second
            one shows the component */}
          <Transition
            style={style.widescreen}
            visible={props.eventPreview.isOpen}
            animation="fly up"
            duration={1000}
          >
            <Segment color={getEventColor(props.eventPreview.event.category)}>
              <div>
                <Header as="h3" floated="left">
                  {props.eventPreview.event.category.toLocaleUpperCase()}
                </Header>
                <Header
                  as="p"
                  floated="right"
                  onClick={() => props.closeEventPreview()}
                >
                  <Icon name="close" size="mini" fitted />
                </Header>
              </div>
              <br />
              <Header as="h4">{props.eventPreview.event.title}</Header>
              <p>{calcAge(props.eventPreview.event.datetime)}</p>
              <Link
                to={`/view/${props.eventPreview.event.key}`}
                onClick={() => props.closeEventPreview()}
              >
                View Incident
              </Link>
              <Button
                primary
                style={{ marginLeft: 12 }}
                onClick={() => props.updateMapPolyline({
                data: props.mapProps.polyline.data,
                isVisible: props.mapProps.polyline.isVisible,
                bounds: props.mapProps.polyline.bounds,
                fitBounds: true,
               })}
              >See Route
              </Button>
              <Dimmer inverted active={props.eventPreview.isOpen && !props.mapProps.polyline.isVisible}>
                <Loader inverted />
              </Dimmer>
            </Segment>
          </Transition>
        </div>
      </Responsive>
      <Responsive maxWidth={900}>
        <div style={style.mobile}>
          <Transition
            style={style.mobile}
            visible={props.eventPreview.isOpen}
            animation="fly up"
            duration={1000}
          >
            <Segment color={getEventColor(props.eventPreview.event.category)}>
              <div>
                <Header as="h3" floated="left">
                  {props.eventPreview.event.category.toLocaleUpperCase()}
                </Header>
                <Header
                  as="p"
                  floated="right"
                  onClick={() => props.closeEventPreview()}
                >
                  <Icon name="close" size="mini" fitted />
                </Header>
              </div>
              <br />
              <Header as="h4">{props.eventPreview.event.title}</Header>
              <p>{calcAge(props.eventPreview.event.datetime)}</p>
              <Link
                to={`/view/${props.eventPreview.event.key}`}
                onClick={() => props.closeEventPreview()}
              >
                View Incident
              </Link>
              <Button
                primary
                style={{ marginLeft: 12 }}
                onClick={() => props.updateMapPolyline({
                data: props.mapProps.polyline.data,
                isVisible: props.mapProps.polyline.isVisible,
                bounds: props.mapProps.polyline.bounds,
                fitBounds: true,
               })}
              >See Route
              </Button>
              <Dimmer inverted active={props.eventPreview.isOpen && !props.mapProps.polyline.isVisible}>
                <Loader inverted />
              </Dimmer>
            </Segment>
          </Transition>
        </div>
      </Responsive>
    </div>
  );
};

EventPreviewCard.propTypes = {
  updateMapPolyline: proptypes.func.isRequired,
  closeEventPreview: proptypes.func.isRequired,
  eventPreview: proptypes.shape({
    event: proptypes.shape({
      key: proptypes.string,
      lat: proptypes.number,
      long: proptypes.number,
      category: proptypes.string,
      title: proptypes.string,
      datetime: proptypes.element,
    }),
    isOpen: proptypes.bool,
  }),
  mapProps: proptypes.shape({
    polyline: proptypes.shape({
      fitBounds: proptypes.bool.isRequired,
      bounds: proptypes.object.isRequired,
      data: proptypes.array.isRequired,
      isVisible: proptypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

EventPreviewCard.defaultProps = {
  eventPreview: null,
};


const mapStateToProps = (state) => {
  const { map } = state;
  const { eventPreview } = state;
  const { event } = state;
  return {
    mapProps: map,
    eventPreview,
    event,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    closeEventPreview,
    updateMapPolyline,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EventPreviewCard);
