const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

dotenv.load({ path: '.env' });

module.exports = {
	entry: [
		"webpack-dev-server/client?http://0.0.0.0:8080",
		"webpack/hot/only-dev-server",
		"./main.js",
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: "bundle.js",
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'GOOGLE_MAP_API': JSON.stringify(process.env.GOOGLE_MAP_API),
			'FACEBOOK_ID': JSON.stringify(process.env.FACEBOOK_ID),
			'GOOGLE_ID': JSON.stringify(process.env.GOOGLE_ID),
		}),
		new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
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
				loader: 'url-loader?limit=100000',
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			}
		]
	}
}
