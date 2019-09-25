import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { markNotificationAsRead } from './actions';
import { STATIC_IMAGES } from '../../utils/apipaths';
import calcAge from '../../utils/time';

const NotificationHeader = (type, userName, category = null) => {
  switch (type) {
    case 'incident':
      return `${userName} reported ${category ? `a ${category} ` : 'an'} incident.`;
    case 'comment':
      return `${userName} commented on a post.`;
    default:
      break;
  }
  return `${userName} notified you`;
};

const altpic = 'https://crowdalert.herokuapp.com/static/images/meerkat.svg';

const NotificationItem = (props) => {
  const { data } = props;
  return (
    <List.Item data-test="component-notification-item">
      <Image avatar src={data.userPicture || altpic} data-test="component-user-image" />
      <List.Content>
        <Link to={`${data.link}`} data-test="link-data">
          <List.Header data-test="component-list-header">
            {NotificationHeader(data.type, data.userName, data.category)}
          </List.Header>
          <List.Description>
            <p data-test="jsx-title">{data.title}</p>
            <span data-test="jsx-datetime">{calcAge(data.datetime)}</span>

          </List.Description>
        </Link>
      </List.Content>
      <List.Content floated="left" verticalAlign="bottom">
        <List.Description />
      </List.Content>
    </List.Item>
  );
};

NotificationItem.propTypes = {
  data: PropTypes.shape({
    userPicture: PropTypes.string,
    link: PropTypes.string,
    type: PropTypes.string,
    userName: PropTypes.string,
    category: PropTypes.string,
    title: PropTypes.string,
    datetime: PropTypes.number,
  }).isRequired,
};

class NotificationsContainer extends Component {
  componentDidMount() {
    this.props.markNotificationAsRead();
  }
  render() {
    const notifications = Object.keys(this.props.notifications).map(key => ({
      ...this.props.notifications[key],
    }));
    return (
      <div style={{ minWidth: '350px', overflowWrap: 'break-word' }} data-test="component-notifications-container">
        {notifications.length ?
          null
        :
          <center data-test="jsx-center-nothing">
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
        <List divided relaxed>
          {notifications.map(data => (
            <NotificationItem data={data} key={data.key} data-test="component-notification-item" />
          ))}
        </List>
      </div>

    );
  }
}
const mapStateToProps = state => ({
  notifications: state.notifications.notifications,
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    markNotificationAsRead,
  }, dispatch)
);

NotificationsContainer.propTypes = {
  notifications: PropTypes.shape({}).isRequired,
  markNotificationAsRead: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
