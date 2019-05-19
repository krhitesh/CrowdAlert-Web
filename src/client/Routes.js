/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { NotificationsPage } from './components/Notifications';
import App from './containers/App/index';
import Viewevent from './containers/Viewevent/index';
import Feed from './containers/Feed/index';
import LoginPage from './containers/Auth/LoginPage';
import SignUpPage from './containers/Auth/SignUpPage';
import ConfirmEmail from './containers/Auth/confirmEmail';

export default [
  {
    ...App,
    routes: [
      {
        component: Feed,
        path: '/',
        exact: true,
      },
      {
        component: Viewevent,
        path: '/view/:eventid',
        exact: true,
      },
      {
        component: LoginPage,
        path: '/login',
        exact: true,
      },
      {
        component: SignUpPage,
        path: '/signup',
        exact: true,
      },
      {
        component: ConfirmEmail,
        path: '/auth/confirmEmail',
        exact: true,
      },
      {
        component: NotificationsPage,
        path: '/notifications',
        exact: true,
      },
    ],
  },
];
