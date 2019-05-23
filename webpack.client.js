const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
  entry: './src/client/client.js',
  cache: false,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.BROWSER': JSON.stringify(true),
      'process.env.REACT_APP_GOOGLE_MAPS_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_KEY),
      'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
      'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
      'process.env.REACT_APP_FIREBASE_DATABASE_URL': JSON.stringify(process.env.REACT_APP_FIREBASE_DATABASE_URL),
      'process.env.REACT_APP_FIREBASE_PROJECT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
      'process.env.REACT_APP_FIREBASE_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_SENDER_ID),
      'process.env.REACT_APP_FACEBOOK_APP_ID': JSON.stringify(process.env.REACT_APP_FACEBOOK_APP_ID),
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = merge(baseConfig, config);
