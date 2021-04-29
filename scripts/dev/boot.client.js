const config = require('@aatif-packages/config');

const webpack = require('webpack');
const args = require('yargs').argv;
const WDS = require('webpack-dev-server');
const appRootDir = require('app-root-dir');
const path = require('path');

module.exports = (DIR) => {
  // const { expose = false, generate = false, boost = false } = args;
  const webpackConfig = require(path.resolve(appRootDir.get(), `./services/${DIR}/webpack-serve.config`));
  const { devServer } = webpackConfig;
  const { host, port } = devServer;

  // if you want to add default webpack alias
  // let routeGateway = path.resolve(appRootDir.get(), `./services/${serviceName}/client/routes/index`);

 
//   webpackConfig.resolve.alias = {
//     ...webpackConfig.resolve.alias,
//    @route-gateway: routeGateway
//   };
 
  const compiler = webpack(webpackConfig);
 

  const server = new WDS(compiler, devServer)
  
  server.listen(port, host);
};
