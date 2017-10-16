const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common-config.js');

module.exports = merge(common, {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
