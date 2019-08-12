/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';
import {
  Segment,
  Message,
  Responsive,
  Form,
  Button,
  Image as SemantiUIImage,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { updateUserCredentials, userImageUploadError } from './actions';
import getWidth from '../../utils/width';
import { UPLOAD_IMAGES, GET_IMAGE_URLS } from '../../utils/apipaths';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: this.props.displayName,
      photoURL: this.props.photoURL,
      image: { base64: null, isUploaded: false },
      isLoading: false,
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  onInputChange(e) {
    this.setState({ displayName: e.target.value });
  }

  onFormSubmit(e) {
    if (this.state.displayName !== this.props.displayName) {
      this.props.updateUserCredentials(null, null, this.state.displayName, null);
    }
    e.preventDefault();
  }

  handleFileUpload() {
    this.setState({ isLoading: true });
    const { image } = this.state;
    const newFormData = new FormData();
    newFormData.append('profile', true);
    newFormData.append('base64', image.base64);
    fetch(UPLOAD_IMAGES, {
      method: 'post',
      body: newFormData,
    })
      .then(resp => resp.json())
      .then(({ name }) => {
        this.props.updateUserCredentials(null, null, null, `${GET_IMAGE_URLS}?uuid=${name}&d=users`);
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        this.props.userImageUploadError(err.message);
        this.setState({ isLoading: false });
      });
  }

  handleFileSelect(accepted) {
    accepted.map((imageFile) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const i = new Image();
        i.onload = () => {
          if (i.width !== i.height) {
            alert('Please upload an image of equal width and height.');
            return;
          }

          const newImage = {
            base64: reader.result,
            isUploaded: false,
          };
          this.setState({
            image: newImage,
          }, () => {
            this.handleFileUpload();
          });
        };
        i.src = reader.result;
      }, false);
      reader.readAsDataURL(imageFile);
      return null;
    });
  }

  render() {
    const imageUri = this.state.image.base64 || this.state.photoURL;
    const isLoading = (this.state.isLoading && !this.props.isLoading) || (!this.state.isLoading && this.props.isLoading);
    return (
      <Segment style={{ minHeight: '500px', padding: '2em' }}>
        <h2>Profile</h2>
        <br />
        {this.props.errors ?
          <Message negative data-test="jsx-error-block">
            <Message.Header>Unable to process request</Message.Header>
            <Message.Content data-test="jsx-error-msg">{this.props.message}</Message.Content>
          </Message>
        : null}
        <Responsive fireOnMount getWidth={getWidth} minWidth={992}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '50%' }}>
              <Form onSubmit={this.onFormSubmit} loading={this.props.isLoading && this.state.image.base64 === null}>
                <Form.Input
                  fluid
                  label="Display Name"
                  placeholder="Set a display name."
                  value={this.state.displayName}
                  onChange={this.onInputChange}
                />
                <div><small>You need to relogin after updating your details.</small></div>
                <br />
                <Button primary>Update</Button>
              </Form>
            </div>
            <div style={{ flex: '50%' }}>
              <div style={{ textAlign: 'center' }}>
                <SemantiUIImage style={{ margin: '0 auto' }} src={imageUri} size="small" circular />
                <Dropzone
                  ref={(node) => { this.dropzoneRef = node; }}
                  onDrop={this.handleFileSelect}
                  style={{ display: 'none' }}
                  data-test="dropzone"
                />
                <Button loading={isLoading && this.state.image.base64 !== null} onClick={() => { this.dropzoneRef.open(); }} primary style={{ margin: '1em 0px 0px 0px' }}>Change photo</Button>
              </div>
            </div>
          </div>
        </Responsive>
        <Responsive fireOnMount getWidth={getWidth} maxWidth={992}>
          <Form onSubmit={this.onFormSubmit} loading={this.props.isLoading && this.state.image.base64 === null}>
            <div style={{ textAlign: 'center', marginBottom: '3em' }}>
              <SemantiUIImage style={{ margin: '0 auto' }} src={imageUri} size="tiny" circular />
              <Dropzone
                ref={(node) => { this.dropzoneRef = node; }}
                onDrop={this.handleFileSelect}
                style={{ display: 'none' }}
                data-test="dropzone"
              />
              <Button loading={isLoading && this.state.image.base64 !== null} onClick={() => { this.dropzoneRef.open(); }} primary style={{ margin: '1em 0px 0px 0px' }}>Change photo</Button>
            </div>
            <Form.Input
              fluid
              label="Display Name"
              placeholder="Set a display name."
              value={this.state.displayName}
              onChange={this.onInputChange}
            />
            <br />
            <div style={{ textAlign: 'center' }}><Button primary>Update</Button></div>
            <div style={{ textAlign: 'center', marginTop: '3em' }}><small>You need to relogin after updating your details.</small></div>
          </Form>
        </Responsive>
        <br />
      </Segment>
    );
  }
}

UserProfile.propTypes = {
  isLoading: propTypes.bool.isRequired,
  errors: propTypes.bool.isRequired,
  message: propTypes.string,
  displayName: propTypes.string.isRequired,
  photoURL: propTypes.string.isRequired,
  userImageUploadError: propTypes.func.isRequired,
  updateUserCredentials: propTypes.func.isRequired,
};

UserProfile.defaultProps = {
  message: null,
};

const mapStateToProps = (state) => {
  const { isLoading, errors, message } = state.user.profile;
  const { displayName, photoURL } = state.auth.user;
  return {
    isLoading,
    errors,
    message,
    displayName,
    photoURL,
  };
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateUserCredentials,
    userImageUploadError,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
