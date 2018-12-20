/* 
* Modified By: Kevin Xu
* File: webpack.config.js
* Description:
*	-> configurations for webpack
**/

const path = require("path");

const config = {
	entry: {
		"renderer": path.join(__dirname, "/src/index.js"),
	},
	output: {
		path: path.resolve(__dirname),
		filename: "[name].js",
		publicPath: "/"
	},
	module: {
		rules: [
			{ test: /\.(js)$/, exclude: /node_modules/, use: "babel-loader" },
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
		]
	},
	target: "electron-renderer",
	externals: {
		"react/addons": true,
		"react/lib/ExecutionEnviroment": true,
		"react/lib/ReactContext": true
	},
	optimization: {
		splitChunks: {
			"chunks": "all",
			"name": "vendors"
		}
	}
};

module.exports = config;