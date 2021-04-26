const path = require('path');

require('@babel/register');

require('dotenv').config({
  path: path.resolve(__dirname, 'env.base'),
});

const args = require('yargs').argv;
const debug = require('debug')('dev:bootstrap');

const { expose = false } = args;
const { DIR = '' } = process.env;
const [serviceName, type] = DIR.split('/');
const __init__ = () => {
  const bootstrap = require(`./boot.${type}`);

  debug(`Preparing ${serviceName} for development...`);

  bootstrap(serviceName, DIR);
};

if (expose) {
  const settingEnv = require('./boot.env');

  settingEnv().then(() => {
    __init__();
  });
} else {
  __init__();
}
