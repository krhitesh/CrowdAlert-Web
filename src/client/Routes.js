/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NotificationsPage } from './components/Notifications';
import App from './containers/App/index';
import Viewevent from './containers/Viewevent/index';
import Feed from './containers/Feed/index';
import LoginPage from './containers/Auth/LoginPage';
import SignUpPage from './containers/Auth/SignUpPage';
import ConfirmEmail from './containers/Auth/confirmEmail';
import CreateEvent from './containers/CreateEvent';
import NotFound from './components/NotFound';

export default [
  {
    ...App,
    routes: [
      {
        ...Feed,
        path: '/',
        exact: true,
      },
      {
        ...CreateEvent,
        path: '/create',
      },
      {
        ...Viewevent,
        path: '/view/:eventid',
      },
      {
        ...LoginPage,
        path: '/login',
        exact: true,
      },
      {
        ...SignUpPage,
        path: '/signup',
        exact: true,
      },
      {
        ...ConfirmEmail,
        path: '/auth/confirmEmail',
        exact: true,
      },
      {
        ...NotificationsPage,
        path: '/notifications',
        exact: true,
      },
      {
        ...NotFound,
      },
    ],
  },
];
