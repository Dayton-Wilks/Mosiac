/* 
* Author: Morgan Loring
*   based on webpack.config.js
* File: webpack.config.test.js
* Description:
*	-> configurations for webpack for unit tests
**/

const path = require("path");

const config = {
	entry: {
		"index": [
			path.join(__dirname, "src/tests/MSTTest.js"),
			path.join(__dirname, "src/tests/boxAndWhiskerTest.js"),
			path.join(__dirname, "src/tests/Redux_Tests/reducers_tests.js"),
			path.join(__dirname, "src/tests/Redux_Tests/actions_tests.js"),
			path.join(__dirname, "src/tests/invalidDataHandling/index.js"),
			path.join(__dirname, "src/tests/stitching/stitchingTest.js"),
			path.join(__dirname, "src/tests/OpenSaveTests/OpenSaveFilesTests.js")
		]
	},
	output: {
		path: path.resolve(path.join(__dirname, "test")),
		filename: "[name].js",
		publicPath: "/"
	},
	module: {
		rules: [
			{ test: /\.(js)$/, exclude: /node_modules/, use: "babel-loader" },
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			// { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
		]
	},
	target: "electron-renderer",
	externals: {
		"react/addons": true,
		"react/lib/ExecutionEnviroment": true,
		"react/lib/ReactContext": true
	}
};

module.exports = config;