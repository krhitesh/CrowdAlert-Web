import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { ShareModal, UpvoteButton, SpamReport } from '../';

/**
 * [EventFooter Footer Bar component for Events Card ]
 * @param {[type]} props [description]
 */
const EventFooter = props => (
  <Button.Group widths={3} basic fluid data-test="component-footer">
    <UpvoteButton uuid={props.uuid} data-test="component-upvote-btn" />
    <ShareModal title={props.title} uuid={props.uuid} data-test="component-share-modal">
      <Button data-test="jsx-btn-share">
        <Icon color="black" name="external share" />
            Share
      </Button>
    </ShareModal>
    <SpamReport.Flag uuid={props.uuid} data-test="component-spamreport-flag" />
  </Button.Group>
);
EventFooter.propTypes = {
  // Title of the incident used for sharing incident
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default EventFooter;
