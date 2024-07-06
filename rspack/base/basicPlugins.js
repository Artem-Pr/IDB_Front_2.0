const rspack = require('@rspack/core')
const {envKeys} = require('../variables.js');

const getBasicPlugins = (mode) => [
  new rspack.CssExtractRspackPlugin({}),
  new rspack.DefinePlugin(envKeys[mode]),
]

module.exports = {getBasicPlugins};