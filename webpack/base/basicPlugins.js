const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const {envKeys} = require('../variables.js');

const getBasicPlugins = (mode) => [
  new MiniCssExtractPlugin(),
  new webpack.DefinePlugin(envKeys[mode]),
]

module.exports = {getBasicPlugins};