/* global document */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Header,
  Icon,
  Grid,
  Modal,
  Responsive,
} from 'semantic-ui-react';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import getWidth from '../../utils/width';
import { DOMAIN_NAME } from '../../utils/apipaths';

/**
* [ShareModal ShareModal conponent for event sharing events across
* different platforms. Opens a new modal for sharing buttons.]
*
* @param {[type]} props [description]
*/
const ShareModal = (props) => {
  // Note that in development environment (i.e. localhost)
  // DOMAIN_NAME points to the django server at localhost:8000
  const shareUrl = `${DOMAIN_NAME}/view/${props.uuid}`;
  const { title } = props;
  return (
    <Modal trigger={props.children} basic size="small">
      <Header icon="external share" content="Share" />
      <Modal.Content>
        <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
          <FacebookShareButton url={shareUrl} quote={title}>
            <Button color="facebook" fluid>
              <Icon name="facebook" />
              Facebook
            </Button>
          </FacebookShareButton>
          <br />
          <TwitterShareButton url={shareUrl} title={title} data-test="component-tw-share">
            <Button color="twitter" fluid data-test="tw-share-content">
              <Icon name="twitter" />
              Twitter
            </Button>
          </TwitterShareButton>
          <br />
          <WhatsappShareButton url={shareUrl} title={title} separator=":: " data-test="component-wa-share">
            <Button color="green" fluid data-test="wa-share-content">
              <Icon name="whatsapp" />
              WhatsApp
            </Button>
          </WhatsappShareButton>
        </Responsive>
        <Responsive fireOnMount getWidth={getWidth} minWidth={900}>
          <Grid columns={3}>
            <Grid.Column>
              <FacebookShareButton url={shareUrl} quote={title} data-test="component-fb-share">
                <Button color="facebook" fluid data-test="fb-share-content">
                  <Icon name="facebook" />
                  Facebook
                </Button>
              </FacebookShareButton>
            </Grid.Column>
            <Grid.Column>
              <TwitterShareButton url={shareUrl} title={title} data-test="component-tw-share">
                <Button color="twitter" fluid data-test="tw-share-content">
                  <Icon name="twitter" />
                  Twitter
                </Button>
              </TwitterShareButton>
            </Grid.Column>
            <Grid.Column>
              <Button color="google plus" fluid data-test="gp-share-content">
                <Icon name="google plus" />
                Google Plus
              </Button>
            </Grid.Column>
          </Grid>
        </Responsive>
      </Modal.Content>
      <Modal.Actions data-test="component-modal-actions" />
    </Modal>
  );
};
ShareModal.propTypes = {
  /* Title to be published on social platforms */
  title: PropTypes.string.isRequired,
  /* Should be a single element which triggers the modal */
  children: PropTypes.element.isRequired,
  uuid: PropTypes.string.isRequired,
};
export default ShareModal;
