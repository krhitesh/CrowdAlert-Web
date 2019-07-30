import React from 'react';
import PropTypes from 'prop-types';
import {
  Feed,
  Image,
  Label,
} from 'semantic-ui-react';
import eventStyles from './styleSheet';
import calcAge from '../../utils/time';
import { STATIC_IMAGES } from '../../utils/apipaths';
/**
 * [EventHeader description]
 * @param {[type]} props [description]
 */
const EventHeader = (props) => {
  const { reportedBy } = props;
  const reporters = Object.keys(reportedBy).map(k => reportedBy[k]);

  return (
    <Feed style={eventStyles.header} data-test="component-header">
      <Feed.Event>
        <Feed.Label>
          <Image
            src={reporters[0].photoURL || `${STATIC_IMAGES}/meerkat.svg`}
            data-test="component-image"
          />
        </Feed.Label>
        <Feed.Content>
          <Feed.Date data-test="component-feed-date">
            {calcAge(props.dateTime)}
          </Feed.Date>
          <Feed.Summary>
            <p data-test="jsx-feed-summary-inner-p">{reporters[0].displayName } reported an incident</p>
          </Feed.Summary>
          <br />
          {props.reverse_geocode ?
            <div data-test="jsx-rev-geocode">
              {props.distance &&
              <Label as="a" basic color="purple" data-test="d-distance">
                {`${props.distance} away`}
              </Label>}
              {props.reverse_geocode.name ?
                <Label as="a" basic color="purple">
                  {props.reverse_geocode.name}
                </Label>
                : null}
              {props.reverse_geocode.admin2 ?
                <Label as="a" basic color="orange">
                  {props.reverse_geocode.admin2}
                </Label>
                : null}
              {props.reverse_geocode.admin1 ?
                <Label as="a" basic color="yellow">
                  {props.reverse_geocode.admin1}
                </Label>
                : null}
            </div>
            : null
          }
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
};

EventHeader.propTypes = {
  reverse_geocode: PropTypes.shape({
    /* Name of the place */
    name: PropTypes.string,
    /* Top levels administative area */
    admin1: PropTypes.string,
    /* Upper administative area */
    admin2: PropTypes.string,
  }),
  /* user_id of the person posting the event */
  // user_id: PropTypes.string.isRequired,
  /* timestamp of the event */
  dateTime: PropTypes.number.isRequired,
  reportedBy: PropTypes.shape({
    original: PropTypes.shape({
      photoURL: PropTypes.string,
      displayName: PropTypes.string,
    }),
  }).isRequired,
  distance: PropTypes.string,
};
EventHeader.defaultProps = {
  reverse_geocode: { name: '', admin2: '', admin1: '' },
  distance: null,
};

export default EventHeader;
