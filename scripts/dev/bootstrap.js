const path = require('path');

require('@babel/register');

require('dotenv').config({
  path: path.resolve(__dirname, 'env.base'),
});

const debug = require('debug')('dev:bootstrap');

const { DIR = '' } = process.env;
const [serviceName, type] = DIR.split('/');
const __init__ = () => {
  const bootstrap = require(`./boot.${type}`);

  debug(`Preparing ${serviceName} for development...`);

  bootstrap(DIR);
};


__init__();

