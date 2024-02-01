const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const {envKeys} = require('../variables.js');


module.exports = [
  new MiniCssExtractPlugin(),
  new webpack.DefinePlugin(envKeys),
];