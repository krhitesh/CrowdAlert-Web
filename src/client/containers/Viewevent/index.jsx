import React, { Component } from 'react';
import propTypes from 'prop-types';
import {
  Responsive,
  Card,
  Image as SemanticImage,
  Item,
  Grid,
  Container,
} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Image,
  Event,
  MapWrapper,
  LoadingCard,
  Sonar,
  CommentsSection,
} from '../../components';
import { WS_NEW_COMMENT_RECEIVED } from '../../components/Comments/actionTypes';
import { fetchEventData, fetchEventDataSSR, fetchReverseGeocodeSSR } from './actions';
import { fetchCommentsThreadSSR } from '../../components/Comments/actions';
import getWidth from '../../utils/width';

import styleSheet from './style';


/**
 * [MapwithSonar Combines the MapWrapper & Sonar component to view a single marker
 * on a single marker]
 * @param {[type]} props [description]
 */
const MapwithSonar = props => (
  <MapWrapper>
    {!props.loading ?
      <Sonar
        lat={props.latitude}
        lng={props.longitude}
        id={null}
        type={props.type}
      />
      : null}
  </MapWrapper>


);
MapwithSonar.propTypes = {
  latitude: propTypes.number.isRequired,
  longitude: propTypes.number.isRequired,
  type: propTypes.string,
  loading: propTypes.bool.isRequired,
};
MapwithSonar.defaultProps = {
  type: undefined,
};
/**
 * [EventCard Combines the all the three parts of event cards to form a single
 * whole component ]
 * @param {[type]} props [description]
 */
const EventCard = props => (
  <Card style={styleSheet[props.viewmode].cardContainer}>
    <Event.Header
      reportedBy={props.reportedBy}
      dateTime={props.datetime}
      reverse_geocode={props.reverse_geocode}
    />
    {(props.spam.count > 2) ?
      <Event.SpamAlert />
    : null}
    <Event.Body
      title={props.title}
      description={props.description}
      spam={props.spam}
      eventType={props.eventType}
    >
      <SemanticImage.Group size={props.viewmode === 'desktop' ? 'small' : 'tiny'}>
        {
          props.images ? props.images.map(image => (
            <Image
              uuid={image.uuid}
              key={image.uuid}
              isTrusted={image.isTrusted}
            />
          )) : null
        }
      </SemanticImage.Group>
    </Event.Body>
    <Event.Footer title={props.title} uuid={props.uuid} />
  </Card>
);
EventCard.propTypes = {
  reportedBy: propTypes.object.isRequired,
  spam: propTypes.object.isRequired,
  viewmode: propTypes.string.isRequired,
  // reportedBy: propTypes..isRequired,
  datetime: propTypes.number.isRequired,
  title: propTypes.string.isRequired,
  description: propTypes.string,
  eventType: propTypes.string,
  reverse_geocode: propTypes.shape({
    /* Name of the place */
    name: propTypes.string,
    /* Top levels administative area */
    admin1: propTypes.string,
    /* Upper administative area */
    admin2: propTypes.string,
  }),
  images: propTypes.arrayOf(propTypes.shape({
    isNsfw: propTypes.bool.isRequired,
    isTrusted: propTypes.bool.isRequired,
    uuid: propTypes.string.isRequired,
  })).isRequired,
  uuid: propTypes.string.isRequired,
};
EventCard.defaultProps = {
  reverse_geocode: { name: '', admin2: '', admin1: '' },
  description: '',
  eventType: 'N/A',
};
/**
 * [Viewevents Responsive Viewevents component. Fetches data & renders the
 * component]
 * @type {Object}
 */
class Viewevent extends Component {
  constructor(props) {
    super(props);
    this.setupSocket = this.setupSocket.bind(this);
  }
  componentDidMount() {
    const { eventid } = this.props.match.params;
    const shouldRefresh =
      this.props.match.params.eventid !== this.props.event.data.eventid;
    this.props.fetchEventData({ eventid, shouldRefresh });

    if (this.props.isLoggedIn) {
      this.props.updateUpvotesLongPollStatus(true);
      this.setupSocket();
    }
  }
  componentWillUnmount() {
    console.log('unmount');

    // Close the socket connection
    if (this.state !== null && this.state.socket && this.state.socket !== null) {
      window.localStorage.setItem('noReconnect', true);
      this.state.socket.close(1000, 'socket closed inside componentWillUnmount');
    }
    this.props.updateUpvotesLongPollStatus(false);
  }
  setupSocket() {
    // eslint-disable-next-line no-undef
    const socket = new WebSocket(`${WS_COMMENTS}/${this.props.match.params.eventid}/`);

    socket.onclose = () => {
      console.log('state', this.state);
      if (window.localStorage.getItem('noReconnect') === 'false') {
        console.log('Socket is closed. Reconnect will be attempted in 5 seconds.');
        setTimeout(this.setupSocket, 5000);
      } else {
        console.log('closing socket conn.');
      }
    };

    socket.onerror = (err) => {
      console.log('socket.onerror', err);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.actionType === WS_NEW_COMMENT_RECEIVED) {
        // console.log('socket.onmessage', message.data);

        // dispatch action to add this message to the state
        // Need to write that action
        this.props.fetchCommentThreadSuccessViaWebSocket(message.data);
      }
    };
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ socket });
    window.localStorage.removeItem('noReconnect');
  }
  // eslint-disable-next-line class-methods-use-this
  head() {
    let image = '';
    // console.log(this.props.event);
    if (this.props.event.data.images !== undefined && this.props.event.data.images.length > 0) {
      if (this.props.event.data.images[0].isNsfw) {
        image = `${GET_IMAGE_URLS}?uuid=${this.props.event.data.eventid}&mode=thumbnail`;
      } else {
        image = `${GET_IMAGE_URLS}?uuid=${this.props.event.data.eventid}`;
      }
    }

    const place = this.props.event.reverse_geocode !== undefined ? this.props.event.reverse_geocode.name : '';
    let coords = {
      latitude: 0.0,
      longitude: 0.0,
    };
    if (this.props.event.data.location !== undefined) {
      coords = this.props.event.data.location.coords;
    }
    return (
      <SEO
        title={`${this.props.event.data.title} near ${place} | Incident Details`}
        url={`${DOMAIN_NAME}/view/${this.props.event.data.eventid}`}
        description={`Incident description: ${this.props.event.data.description} | Geo location: Latitude=${coords.latitude} Longitude=${coords.longitude}`}
        image={image}
      />
    );
  }
  render() {
    let lat = 0;
    let lng = 0;
    if (this.props.event.isLoading) {
      ({ lat, lng } = this.props.map);
    } else {
      ({ latitude: lat, longitude: lng } = this.props.event.data.location.coords);
    }
    return (
      <div style={{ paddingTop: '1rem', marginBottom: '6rem' }} data-test="component-viewevent">
        {this.head()}
        <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
          <div style={styleSheet.mobile.mapContainer}>
            <MapwithSonar
              latitude={lat}
              longitude={lng}
              type={this.props.event.data.category}
              loading={this.props.event.isLoading}
              data-test="component-mapwithsonar"
            />

          </div>
          <Item style={styleSheet.mobile.itemContainer}>
            {
              this.props.event.isLoading
              ? <LoadingCard loading data-test="component-loadingcard" />
              :
              <EventCard
                viewmode="mobile"
                reportedBy={this.props.event.data.reportedBy}
                datetime={this.props.event.data.datetime}
                title={this.props.event.data.title}
                description={this.props.event.data.description}
                images={this.props.event.data.images}
                reverse_geocode={this.props.event.reverse_geocode}
                eventType={this.props.event.data.category}
                uuid={this.props.match.params.eventid}
                spam={this.props.event.data.spam}
                data-test="component-event-card"
              />
          }
            {!this.props.event.isLoading ?
              <CommentsSection
                threadId={this.props.match.params.eventid}
                data-test="component-comments-section"
              />
            : null }
          </Item>
        </Responsive>
        <Responsive fireOnMount getWidth={getWidth} minWidth={901}>
          <Container>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <div style={styleSheet.desktop.mapContainer}>
                    <MapwithSonar
                      latitude={lat}
                      longitude={lng}
                      type={this.props.event.data.category}
                      loading={this.props.event.isLoading}
                      data-test="component-mapwithsonar"
                    />
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <Item style={styleSheet.desktop.itemContainer}>
                    {
                      this.props.event.isLoading
                        ? <LoadingCard loading data-test="component-loadingcard" />
                        :
                        <EventCard
                          viewmode="desktop"
                          reportedBy={this.props.event.data.reportedBy}
                          datetime={this.props.event.data.datetime}
                          title={this.props.event.data.title}
                          description={this.props.event.data.description}
                          images={this.props.event.data.images}
                          reverse_geocode={this.props.event.reverse_geocode}
                          eventType={this.props.event.data.category}
                          spam={this.props.event.data.spam}
                          uuid={this.props.match.params.eventid}
                          data-test="component-event-card"
                        />
                    }
                    {!this.props.event.isLoading ?
                      <CommentsSection
                        threadId={this.props.match.params.eventid}
                        data-test="component-comments-section"
                      />
                    : null }
                  </Item>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Responsive>
      </div>
    );
  }
}
Viewevent.propTypes = {
  isLoggedIn: propTypes.bool.isRequired,
  fetchCommentThreadSuccessViaWebSocket: propTypes.func.isRequired,
  updateUpvotesLongPollStatus: propTypes.func.isRequired,
  match: propTypes.shape({
    params: propTypes.shape({
      eventid: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  fetchEventData: propTypes.func.isRequired,
  event: propTypes.shape({
    reverse_geocode: propTypes.object,
    isLoading: propTypes.bool,
    data: propTypes.shape({
      reportedBy: propTypes.object.isRequired,
      datetime: propTypes.number,
      title: propTypes.string,
      description: propTypes.string,
      images: propTypes.arrayOf(propTypes.shape({
        isNsfw: propTypes.bool.isRequired,
        isTrusted: propTypes.bool.isRequired,
        uuid: propTypes.string.isRequired,
      })).isRequired,
      spam: propTypes.object,
      eventid: propTypes.string,
      location: propTypes.shape({
        coords: propTypes.shape({
          latitude: propTypes.number,
          longitude: propTypes.number,
        }),
      }),
      category: propTypes.string,
    }).isRequired,
  }).isRequired,
  map: propTypes.shape({
    lat: propTypes.number,
    lng: propTypes.number,
  }).isRequired,
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchEventData,
    fetchCommentThreadSuccessViaWebSocket,
    updateUpvotesLongPollStatus,
  }, dispatch)
);
const mapStateToProps = state => ({
  map: state.map,
  event: state.event,
  isLoggedIn: state.auth.isLoggedIn,
});
export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Viewevent),
};
