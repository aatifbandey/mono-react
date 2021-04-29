const webpack = require('webpack');
const appRootDir = require('app-root-dir');
const path = require('path');
const WDS = require('webpack-dev-server');
const logError = require('debug')('build:error');

module.exports = (DIR) => {
  const webpackConfig = require(path.resolve(appRootDir.get(), `./services/${DIR}/webpack.config.babel`)).default;
 
  const compiler = webpack(webpackConfig);
 

  const server = new WDS(compiler)

  webpack(webpackConfig).watch(
    {
      aggregateTimeout: 300,
      poll: 1000,
    },
    err => {
      if (err) {
        logError(err.stack || err);

        if (err.details) {
          logError(err.details);
        }
      }
    },
  );
};