module.exports = {
	entry: "./main.js",
	output: {
		path: 'public',
		filename: "bundle.js",
		publicPath: '/'
	},
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
			}
		]
	}
}