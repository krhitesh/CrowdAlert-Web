import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { ShareModal, UpvoteButton, SpamReport, Directions } from '../';

/**
 * [EventFooter Footer Bar component for Events Card ]
 * @param {[type]} props [description]
 */
const EventFooter = props => (
  <Button.Group widths={4} basic fluid>
    <UpvoteButton uuid={props.uuid} />
    <Directions htmlInstructions={props.htmlInstructions}>
      <Button>
        <Icon color="black" name="location arrow" />
            Directions
      </Button>
    </Directions>
    <ShareModal title={props.title}>
      <Button>
        <Icon color="black" name="external share" />
            Share
      </Button>
    </ShareModal>
    <SpamReport.Flag uuid={props.uuid} />
  </Button.Group>
);
EventFooter.propTypes = {
  // Title of the incident used for sharing incident
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  htmlInstructions: PropTypes.arrayOf(PropTypes.string),
};
EventFooter.defaultProps = {
  htmlInstructions: ['No directions available'],
};
export default EventFooter;
