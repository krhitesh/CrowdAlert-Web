const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const baseConfig = require('./webpack.base.js');

const config = {
  entry: './src/client/client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(true),
      'process.env.REACT_APP_GOOGLE_MAPS_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_KEY),
      'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
      'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
      'process.env.REACT_APP_FIREBASE_DATABASE_URL': JSON.stringify(process.env.REACT_APP_FIREBASE_DATABASE_URL),
      'process.env.REACT_APP_FIREBASE_PROJECT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
      'process.env.REACT_APP_FIREBASE_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_SENDER_ID),
      'process.env.REACT_APP_FACEBOOK_APP_ID': JSON.stringify(process.env.REACT_APP_FACEBOOK_APP_ID),
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, './public/firebase-messaging-sw.js'),
    }),
  ],
};

module.exports = merge(baseConfig, config);
