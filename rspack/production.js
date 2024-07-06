const rspack = require('@rspack/core')

const {getBasicPlugins} = require('./base/basicPlugins.js');
const {
    config,
    MODES,
    paths,
} = require('./variables.js');

module.exports = {
    mode: MODES.PROD,
    devtool: false,
    output: {
        filename: '[name].[contenthash].js',
        path: paths.build,
        publicPath: config.HOST_APP_BUILD.URL, // we can use just '/'
    },
    plugins: [
        ...getBasicPlugins(MODES.PROD),
        new rspack.HtmlRspackPlugin({
            title: 'IDB',
            minify: true,
            template: paths.html,
            favicon: paths.public + '/favicon.ico'
        }),
    ],
    optimization: {
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin({
                compress: true,
                format: {
                    comments: false
                }
            }),
            new rspack.LightningCssMinimizerRspackPlugin(),
        ],
    },
};