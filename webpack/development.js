const HtmlWebpackPlugin = require('html-webpack-plugin');

const basicPlugins = require('./base/basicPlugins.js');
const {
    MODES,
    config,
    paths,
} = require('./variables.js');

module.exports = {
    mode: MODES.DEV,
    output: {
      publicPath: config.HOST_APP.URL,
    },
    devtool: 'source-map',
    devServer: {
      port: config.HOST_APP.PORT,
      host: config.HOST_APP.HOST,
      compress: true,
      hot: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      static: {
        directory: paths.public,
      },
    },
    plugins: [
        ...basicPlugins,
        new HtmlWebpackPlugin({
          template: paths.html,
          favicon: paths.public + '/favicon.ico'
        }),
    ],
};