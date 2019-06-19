const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');

// Brotli compression and therefore generating server bundle.js.br is not required
// as it is NOT send to client's browser.
// Remove the brotli compression plugin. It is the last element in the plugins array.
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
    }),
    new Dotenv({
      path: './.env',
    }),
  ],
  externals: [webpackNodeExternals()],
};

module.exports = merge(baseConfig, config);
