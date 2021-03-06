import React from 'react';
import PropTypes from 'prop-types';
import { Item, Divider, Label } from 'semantic-ui-react';
import styleSheet from './styleSheet';
import { SafeText } from '../';

/**
 * [getEventColor returns event color according event type]
 * @param  {[type]} type [event type]
 * @return {[type]}      [event color]
 */
const getEventColor = (type) => {
  let eventColor = '';
  switch (type) {
    case 'fire':
      eventColor = 'red';
      break;
    case 'road':
      eventColor = 'brown';
      break;
    case 'health':
      eventColor = 'teal';
      break;
    case 'electric':
      eventColor = 'yellow';
      break;
    default:
      eventColor = 'blue';
  }
  return eventColor;
};
/**
 * [Body JSX element for Event Card Body. Contains the event description]
 * @param {[type]} props
 */

const Body = props => (
  <Item.Content data-test="component-body">
    <Item.Header as="a">{props.title}</Item.Header>
    <Label
      color={getEventColor(props.eventType)}
      ribbon
      style={styleSheet.ribbonLabel}
    >
      {props.eventType.toLocaleUpperCase()}
    </Label>
    {props.desktop ?
      <Item.Meta data-test="jsx-desktop">Description</Item.Meta>
    : null}
    <Item.Description>
      <SafeText spam={props.spam}>
        {props.description}
      </SafeText>
    </Item.Description>
    <Divider section />
    <Item.Extra>
      {props.children}
    </Item.Extra>
  </Item.Content>
);

Body.propTypes = {
  // Title of the incident
  title: PropTypes.string.isRequired,
  // Whether the preview device is a desptop.
  desktop: PropTypes.bool,
  // Description of the incident
  description: PropTypes.string,
  // Images and other stuff
  children: PropTypes.node.isRequired,
  //  Event type
  eventType: PropTypes.string,
  spam: PropTypes.shape({
    errors: PropTypes.bool,
    message: PropTypes.string,
    modal: PropTypes.shape({
      open: PropTypes.bool,
    }),
  }).isRequired,
};
Body.defaultProps = {
  desktop: false,
  description: 'None available',
  eventType: 'N/A',
};

export default Body;
