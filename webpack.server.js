const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');

/*
Brotli compression and therefore generating server bundle.js.br is not required
as it is NOT send to client's browser.
Remove the brotli compression plugin. It is the last element in the plugins array.
*/
baseConfig.plugins.pop();

const config = {
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(false),
      'process.env.REACT_APP_GOOGLE_MAPS_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_KEY),
      'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
      'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
      'process.env.REACT_APP_FIREBASE_DATABASE_URL': JSON.stringify(process.env.REACT_APP_FIREBASE_DATABASE_URL),
      'process.env.REACT_APP_FIREBASE_PROJECT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
      'process.env.REACT_APP_FIREBASE_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_SENDER_ID),
      'process.env.REACT_APP_FACEBOOK_APP_ID': JSON.stringify(process.env.REACT_APP_FACEBOOK_APP_ID),

      'process.env.DJANGO_FIREBASE_FCM_SENDER_TOKEN': JSON.stringify(process.env.DJANGO_FIREBASE_FCM_SENDER_TOKEN),
      'process.env.DJANGO_FIREBASE_type': JSON.stringify(process.env.DJANGO_FIREBASE_type),
      'process.env.DJANGO_FIREBASE_project_id': JSON.stringify(process.env.DJANGO_FIREBASE_project_id),
      'process.env.DJANGO_FIREBASE_private_key_id': JSON.stringify(process.env.DJANGO_FIREBASE_private_key_id),
      'process.env.DJANGO_FIREBASE_private_key': JSON.stringify(process.env.DJANGO_FIREBASE_private_key).replace(/\\n/g, '\n'),
      'process.env.DJANGO_FIREBASE_client_email': JSON.stringify(process.env.DJANGO_FIREBASE_client_email),
      'process.env.DJANGO_FIREBASE_client_id': JSON.stringify(process.env.DJANGO_FIREBASE_client_id),
      'process.env.DJANGO_FIREBASE_auth_uri': JSON.stringify(process.env.DJANGO_FIREBASE_auth_uri),
      'process.env.DJANGO_FIREBASE_token_uri': JSON.stringify(process.env.DJANGO_FIREBASE_token_uri),
      'process.env.DJANGO_FIREBASE_auth_provider_x509_cert_url': JSON.stringify(process.env.DJANGO_FIREBASE_auth_provider_x509_cert_url),
      'process.env.DJANGO_FIREBASE_client_x509_cert_url': JSON.stringify(process.env.DJANGO_FIREBASE_client_x509_cert_url),
    }),
  ],
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, config);
