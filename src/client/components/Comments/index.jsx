/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { Comment, Image, Card, Icon, Feed, Form, Responsive, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  LoadingCard,
  UpvoteButton,
  SafeText,
  SpamReport,
} from '../';
import {
  fetchCommentsThread,
  fetchCommentsThreadCancel,
  postCommentToThread,
} from './actions';
import { STATIC_IMAGES } from '../../utils/apipaths';
import calcAge from '../../utils/time';
import getWidth from '../../utils/width';

class CommentsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.fetchCommentsThread(this.props.threadId, true);
  }
  handleInputChange(event) {
    const { target } = event;
    const { value } = target;
    const { name } = target;

    this.setState({
      ...this.state,
      [name]: value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { comment } = this.state;
    if (!comment) {
      return false;
    }
    const { threadId } = this.props.comments;
    this.setState({
      comment: '',
    });
    this.props.postCommentToThread(comment, threadId);
  }
  render() {
    if (this.props.comments.loading) {
      return (<LoadingCard loading data-test="component-comments-section-loading" />);
    }
    return (
      <Card style={{ width: '95%', padding: '0.3rem' }} color="red" data-test="component-comments-section">
        <Card.Content>
          <Feed>
            <Feed.Event>
              <Feed.Label
                image={this.props.auth.user.photoURL ||
                 `${STATIC_IMAGES}/meerkat.svg`}
                style={{ marginTop: '1rem' }}
                data-test="jsx-user-image"
              />
              <Feed.Content>
                <Feed.Summary>
                Write a comment
                </Feed.Summary>
                <Feed.Extra text>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                      <Form.Field width={13} data-test="jsx-comment-input">
                        <Form.TextArea
                          autoheight="true"
                          placeholder="Comment.."
                          name="comment"
                          onChange={this.handleInputChange}
                          value={this.state.comment}
                        />
                      </Form.Field>
                      <Form.Field width={3} style={{ paddingLeft: '0rem' }}>
                        <Responsive fireOnMount getWidth={getWidth} minWidth={901}>
                          <Form.Button width={2} color="teal">
                            <Icon name="comment" />
                          </Form.Button>
                        </Responsive>
                        <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
                          <Form.Button
                            width={2}
                            color="teal"
                            style={{ marginTop: '1rem' }}
                            icon
                            labelPosition="left"
                            loading={this.props.comments.commentButtonLoading}
                            disabled={this.props.comments.commentButtonLoading}
                            data-test="jsx-btn-responsive"
                          >
                            <Icon name="comment" />
                            {/* Warning: Did not expect server HTML to contain the text node "Post" in <button>. */}
                            Post
                          </Form.Button>
                        </Responsive>
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          </Feed>
          {this.props.comments.errors ?
            <Message negative data-test="jsx-error-block">
              <Message.Header>Unable to Post Comment</Message.Header>
              <Message.Content data-test="jsx-error-msg">{this.props.comments.message}</Message.Content>
            </Message>
          : null}
        </Card.Content>
        <Card.Content>
          <Comment.Group data-test="jsx-comments-group">
            {this.props.comments.comments.map(comment => (
              <Comment key={comment.key} data-test="jsx-comment">
                <Image
                  src={this.props.comments.userData[comment.user].photoURL ||
                      `${STATIC_IMAGES}/meerkat.svg`}
                  style={{
                    borderRadius: '500rem',
                    display: 'block',
                    marginRight: '1rem',
                    marginBottom: '1rem',
                    width: '2.5em',
                    height: 'auto',
                    float: 'left',
                    lineHeight: '1.2em',
                  }}
                />
                <Comment.Content>
                  <Comment.Author as="a">
                    {this.props.comments.userData[comment.user].displayName}
                  </Comment.Author>
                  <Comment.Metadata as="a">
                    <span>{calcAge(comment.timestamp)}</span>
                  </Comment.Metadata>
                  <Comment.Text>
                    <SafeText spam={comment.spam}>
                      {comment.text}
                    </SafeText>
                  </Comment.Text>
                  <Comment.Actions>
                    <UpvoteButton basic uuid={comment.key} data-test="component-upvote"/>
                    <SpamReport.Flag basic uuid={comment.key} data-test="component-spamreport-flag" />
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ))}
            {this.props.comments.comments.length ?
            null
            :
            <center data-test="jsx-nothing-here">
              <Image
                src={`${STATIC_IMAGES}/meerkat.svg`}
                size="tiny"
                circular
                bordered
                centered
                disabled
              />
              <br />
              <p>Nothing here</p>
            </center>
            }
          </Comment.Group>
        </Card.Content>
      </Card>
    );
  }
}

CommentsSection.propTypes = {
  fetchCommentsThread: PropTypes.func.isRequired,
  postCommentToThread: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
  comments: PropTypes.shape({
    loading: PropTypes.bool,
    threadId: PropTypes.string,
    commentButtonLoading: PropTypes.bool,
    errors: PropTypes.bool,
    message: PropTypes.string,
    comments: PropTypes.any,
    userData: PropTypes.object,
  }).isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = state => ({
  comments: state.comments,
  auth: state.auth,
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchCommentsThread,
    fetchCommentsThreadCancel,
    postCommentToThread,
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(CommentsSection);
