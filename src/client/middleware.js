import { updateLocationMiddleware, fetchEventsOnMapUpdateMiddleware } from './containers/Feed/middleware';
import fetchEventDataMiddleware from './containers/Viewevent/middleware';
import eventPreviewMiddleware from './components/EventPreviewCard/middleware';
import geoLocationMiddleware from './components/Geolocator/middleware';
import createEventsMiddleware from './containers/CreateEvent/middleware';
import commentsMiddleware from './components/Comments/middleware';
import notificationsMiddleware from './components/Notifications/middleware';
import upvoteMiddleware from './components/Upvote/middleware';
import userMiddleware from './containers/User/middleware';
import homeLocationMiddleware from './components/HomeLocationModal/middleware';
import editEventsMiddleware from './containers/EditEvent/middleware';

import {
  authMiddleware,
  emailPasswordAuthMiddleware,
  oAuthMiddleware,
} from './containers/Auth/middleware';

const middlewares = [
  authMiddleware,
  updateLocationMiddleware,
  fetchEventsOnMapUpdateMiddleware,
  fetchEventDataMiddleware,
  eventPreviewMiddleware,
  geoLocationMiddleware,
  createEventsMiddleware,
  emailPasswordAuthMiddleware,
  oAuthMiddleware,
  commentsMiddleware,
  notificationsMiddleware,
  upvoteMiddleware,
  userMiddleware,
  homeLocationMiddleware,
  editEventsMiddleware,
];

export default middlewares;
