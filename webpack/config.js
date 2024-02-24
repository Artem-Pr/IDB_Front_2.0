const {merge} = require('webpack-merge');
const basicConfig = require('./base/basicConfig');
const development = require('./development.js');
const production = require('./production');
const {MODES, envKeys, envPorts} = require('./variables.js');

module.exports = (_, args) => {

    console.log('🚀 run webpack:', args)
    console.log(`env ports[${args.mode}]:`, envPorts[args.mode]);
    console.log(`env front keys[${args.mode}]:`, envKeys[args.mode]);

    switch(args.mode) {
      case MODES.DEV:
        return merge(basicConfig(true), development);
      case MODES.PROD:
        return merge(basicConfig(false), production);
      default:
        throw new Error('No matching configuration was found!');
    }
  }