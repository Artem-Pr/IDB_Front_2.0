const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const basicPlugins = require('./base/basicPlugins.js');
const {
    config,
    MODES,
    paths,
} = require('./variables.js');

module.exports = {
    mode: MODES.PROD,
    output: {
        filename: '[name].[contenthash].js',
        path: paths.build,
        publicPath: config.HOST_APP.URL,
    },
    plugins: [
        ...basicPlugins,
        new HtmlWebpackPlugin({
            title: 'IDB',
            minify: true,
            template: paths.html,
            favicon: paths.public + '/favicon.ico'
        }),
    ],
    optimization: {
        minimizer: [new TerserPlugin()],
    },
};