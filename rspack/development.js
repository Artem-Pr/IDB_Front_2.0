const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const rspack = require('@rspack/core')

const {getBasicPlugins} = require('./base/basicPlugins.js');
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
      ...getBasicPlugins(MODES.DEV),
      new ReactRefreshPlugin(),
      new rspack.HtmlRspackPlugin({
        template: paths.html,
        favicon: `${paths.public}/favicon.ico`,
      }),
  ],
};