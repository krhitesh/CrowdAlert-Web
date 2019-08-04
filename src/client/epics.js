import { combineEpics } from 'redux-observable';

// Import epics and combine
import feedEpic from './containers/Feed/epic';
import eventEpic from './containers/Viewevent/epics';
import createEventsEpic from './containers/CreateEvent/epics';
import userEpic from './containers/User/epics';
import commentsEpics from './components/Comments/epics';
import upvotesEpics from './components/Upvote/epics';
import spamReportEpics from './components/SpamReport/epics';
import notificationsEpics from './components/Notifications/epics';
import homeLocationEpic from './components/HomeLocationModal/epics';
import editEventsEpic from './containers/EditEvent/epics';

const rootEpic = combineEpics(
  feedEpic,
  eventEpic,
  createEventsEpic,
  userEpic,
  commentsEpics,
  upvotesEpics,
  spamReportEpics,
  notificationsEpics,
  homeLocationEpic,
  editEventsEpic,
);

export default rootEpic;
