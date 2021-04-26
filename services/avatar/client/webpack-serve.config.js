require('@babel/register');
const fs = require('fs');
const config = require('@aatif-packages/config');


global.__DEV__ = true;
global.__TEST__ = false;
global.__PROD__ = false;
global.__GITREV__ = 'localdev';
global.__CONSTANTS__ = config.getConstants();

const { default: webpackMobileConfig } = require('./webpack.config.babel');


const host = config.get('HOST');
const port = config.get('CLIENT.PORT');

const apiProxiesEnable = config.get('CLIENT.API.PROXIES.ENABLE');
const apiProxiesHostname = config.get('CLIENT.API.PROXIES.HOSTNAME');

const httpsKey = config.get('HTTPS_KEY_FILE');
const httpsCert = config.get('HTTPS_CERT_FILE');

// devServer list of available options: https://github.com/webpack/webpack-dev-server/blob/master/lib/options.json
webpackMobileConfig.devServer = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    disableHostCheck: true,
    historyApiFallback: {
      rewrites: [{ from: /\/*.pl$/, to: '/index.html' }],
    },
    // before: app => {
    //   app.use(async (req, res, next) => {
    //     const testJS = /.*.js$/;
  
    //     if (testJS.test(req.path)) {
    //       res.removeHeader('Content-Type');
    //       res.setHeader('Content-Type', 'application/javascript');
  
    //       const originalSetHeader = res.setHeader.bind(res);
    //       res.setHeader = (key, value) => {
    //         if (key === 'Content-Type') {
    //           // prevent content-type to be set again
    //           // this is a hack to bypass webpack-dev-middleware
    //           // https://github.com/jhnns/webpack-dev-middleware/blob/a51750f63dc6fd8d20986ec457823557717e2f92/middleware.js#L131
    //           return;
    //         }
  
    //         originalSetHeader(key, value);
    //       };
    //     }
  
    //     await next();
    //   });
    // },
    // after: app => {
    //   app.use(async (req, res, next) => {
    //     if (req.path === '/manifest.json') {
    //       res.status('200');
    //       res.send(manifestJson);
  
    //       return;
    //     }
  
    //     await next();
    //   });
  
    //   app.use(swMiddleware());
    // },
    host,
    hot: true,
    ...(httpsKey && httpsCert ? { https: { key: fs.readFileSync(httpsKey), cert: fs.readFileSync(httpsCert) } } : {}),
    logLevel: 'error', // this log is displayed in console output
    clientLogLevel: 'error', // this log is displayed in browser
    port,
    publicPath: webpackMobileConfig.output.publicPath,
    overlay: {
      warnings: false,
      errors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules([\\]+|\/)/,
      poll: 1000,
    },
  };


if (apiProxiesEnable) {
  webpackMobileConfig.devServer.proxy = {
    '/graphql': {
      target: apiProxiesHostname,
      headers: {
        Origin: 'https://deals24.com',
      },
    },
  };
}

module.exports = webpackMobileConfig;