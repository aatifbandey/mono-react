const path = require('path');
const appRootDir = require('app-root-dir');
const rootResolver = require('@aatif-packages/tools/import.resolver');

module.exports = {
  resolve: {
    modules: ['node_modules'],
    alias: {
      ...rootResolver.resolve.alias,
      ...rootResolver.relativeAliases('avatar'),
      '@routes': path.resolve(appRootDir.get(), './services/avatar/client/routes/'),
      '@': path.resolve(appRootDir.get(), './services/avatar/client/'),
      // '@route-gateway': path.resolve(appRootDir.get(), './services/poseidon/client/routes/index.js'),
      
    },
  },
};
