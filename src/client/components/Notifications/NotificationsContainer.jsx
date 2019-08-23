import React, { Component } from 'react';
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
    <List.Item>
      <Image avatar src={data.userPicture || altpic} />
      <List.Content>
        <Link to={`${data.link}`}>
          <List.Header>
            {NotificationHeader(data.type, data.userName, data.category)}
          </List.Header>
          <List.Description>
            <p>{data.title}</p>
            <span>{calcAge(data.datetime)}</span>

          </List.Description>
        </Link>
      </List.Content>
      <List.Content floated="left" verticalAlign="bottom">
        <List.Description />
      </List.Content>
    </List.Item>
  );
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
      <div style={{ minWidth: '350px', overflowWrap: 'break-word' }}>
        {notifications.length ?
          null
        :
          <center>
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
            <NotificationItem data={data} key={data.key} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
