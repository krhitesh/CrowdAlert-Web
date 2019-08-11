import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Modal, Responsive } from 'semantic-ui-react';
import { GET_IMAGE_URLS } from '../../utils/apipaths';
import getWidth from '../../utils/width';

/**
 * [ImageModal Displays a small thumbnail & opens a large modal onclick]
 * @param {[type]} props [description]
 */

export default class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: this.props.uuid,
      loading: !!this.props.uuid,
      base64: this.props.base64,
    };
  }
  componentWillMount() {
    if (this.state.uuid) {
      this.setState({
        ...this.state,
        imageUrls: {
          url: `${GET_IMAGE_URLS}?uuid=${this.state.uuid}`,
          thumbnail: `${GET_IMAGE_URLS}?uuid=${this.state.uuid}&mode=thumbnail`,
        },
        loading: false,
      });
    } else if (!!this.state.base64 === true) {
      this.setState({
        ...this.state,
        imageUrls: {
          url: this.state.base64,
          thumbnail: this.state.base64,
        },
        loading: false,
      });
    }
  }
  render() {
    if (this.state.loading !== true
      && this.state.imageUrls !== undefined && this.state.imageUrls.url !== '') {
      return (
        <Modal
          trigger={
            this.props.children ? this.props.children :
            <Image
              src={`${this.props.isTrusted
                ? this.state.imageUrls.url
                : this.state.imageUrls.thumbnail}`}
              size="small"
              style={{
                height: '15vh',
                width: '10rem',
                backgroundImage: `url(${this.state.imageUrls.thumbnail})`,
              }}
              data-test="component-modal-trigger-image"
            />
          }
          closeIcon
          data-test="component-image-modal"
        >
          <Modal.Header data-test="component-modal-header">
            <div>
              <p>Photo</p>
            </div>
          </Modal.Header>
          <Modal.Content>
            <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
              <Image
                fluid
                label={this.props.isTrusted ? null : {
                  as: 'a',
                  color: 'red',
                  content: 'Unverified',
                  icon: 'warning circle',
                  ribbon: true,
                }}
                src={`${this.state.imageUrls.url}`}
                style={{
                  background: `url(${this.state.imageUrls.thumbnail}) no-repeat`,
                  minHeight: '28vh',
                }}
                data-test="component-image"
              />
            </Responsive>
            <Responsive fireOnMount getWidth={getWidth} minWidth={900}>
              <Image
                size="massive"
                label={this.props.isTrusted ? null : {
                  as: 'a',
                  color: 'red',
                  content: 'Unverified',
                  icon: 'warning circle',
                  ribbon: true,
                }}
                src={`${this.state.imageUrls.url}`}
                style={{
                  background: `url(${this.state.imageUrls.thumbnail}) no-repeat`,
                  minHeight: '60vh',
                }}
                data-test="component-image"
              />
            </Responsive>
          </Modal.Content>
        </Modal>
      );
    }
    return (
      <p>Image not available</p>
    );
  }
}

ImageModal.propTypes = {
  uuid: PropTypes.string,
  base64: PropTypes.string,
  children: PropTypes.node,
  isTrusted: PropTypes.bool,
};
ImageModal.defaultProps = {
  uuid: null,
  base64: null,
  isTrusted: false,
  children: null,
};
