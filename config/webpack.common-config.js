const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

dotenv.load({ path: '.env' });

module.exports = {
  entry: [
    './main.js',
  ],
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      GOOGLE_MAP_API: JSON.stringify(process.env.GOOGLE_MAP_API),
      FACEBOOK_ID: JSON.stringify(process.env.FACEBOOK_ID),
      FACEBOOK_PAGE_TOKEN: JSON.stringify(process.env.FACEBOOK_PAGE_TOKEN),
      FACEBOOK_PAGE_ID: JSON.stringify(process.env.FACEBOOK_PAGE_ID),
      GOOGLE_ID: JSON.stringify(process.env.GOOGLE_ID),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader',
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?\S*)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      }
    ]
  }
};
