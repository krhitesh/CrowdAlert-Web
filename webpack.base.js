const webpack = require('webpack');
const merge = require('webpack-merge');
const minify = require('./webpack.minify');

let NODE_ENV = '"development"';
const prod = process.argv.indexOf('-p') !== -1;
if (prod) {
  NODE_ENV = '"production"';
}

const config = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0',
        ],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.css$/,
        use: ['isomorphic-style-loader', { loader: 'css-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': NODE_ENV,
    }),
  ],
};

if (prod) {
  module.exports = merge(config, minify);
} else {
  module.exports = config;
}
