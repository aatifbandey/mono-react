const webpack = require('webpack');
const appRootDir = require('app-root-dir');
const path = require('path');
const logError = require('debug')('build:error');

module.exports = (DIR) => {
  const webpackConfig = require(path.resolve(appRootDir.get(), `./services/${DIR}/webpack.config.babel`)).default;
	
	// webpack(webpackConfig)
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