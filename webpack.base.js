module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0',
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader',
      },
      { test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.css$/,
        loader: 'style-loader',
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
