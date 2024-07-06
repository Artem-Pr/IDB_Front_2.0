const {merge} = require('webpack-merge');
const basicConfig = require('./base/basicConfig.js');
const development = require('./development.js');
const production = require('./production.js');
const {MODES, envKeys, envPorts} = require('./variables.js');

const mode = process.env.NODE_ENV

module.exports = (_, argv) => {
  console.log('🚀 rspack argv:', argv)
  console.log(`env ports[${mode}]:`, envPorts[mode]);
  console.log(`env front keys[${mode}]:`, envKeys[mode]);

  switch(process.env.NODE_ENV) {
    case MODES.DEV:
      return merge(basicConfig(true), development);
    case MODES.PROD:
      return merge(basicConfig(false), production);
    default:
      throw new Error('No matching configuration was found!');
  }
}