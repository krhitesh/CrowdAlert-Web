const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.BROWSER': JSON.stringify(true),
      __DEV__: true,
    }),
  ],
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, config);
