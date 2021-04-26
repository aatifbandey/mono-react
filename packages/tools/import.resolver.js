const path = require('path');
const appRootDir = require('app-root-dir');
const fs = require('fs');

module.exports = {
  resolve: {
    modules: ['node_modules'],
    alias: {
      '@shared': path.resolve(appRootDir.get(), './shared/'),
      '@babel': path.resolve(appRootDir.get(), './packages/tools/node_modules/@babel'),
      'core-js': path.resolve(appRootDir.get(), './packages/tools/node_modules/core-js'),
      'regenerator-runtime': path.resolve(appRootDir.get(), './packages/tools/node_modules/regenerator-runtime'),
    },
  },
  relativeAliases: service => {
    /**
     * If the service has its own specific `react`,`react-dom`, or deps, we alias all `require('react')` calls to that one.
     * To avoid version mismatch problems
     *
     * Read: `docs/general/monorepo-caveats.md`
     */
    const serviceReactPath = path.resolve(appRootDir.get(), 'services', service, 'node_modules', 'react');
    const serviceReactDOMPath = path.resolve(appRootDir.get(), 'services', service, 'node_modules', 'react-dom');
   

    const rootReactPath = path.resolve(appRootDir.get(), 'node_modules', 'react');
    const rootReactDOMPath = path.resolve(appRootDir.get(), 'node_modules', 'react-dom');
   

    const serviceHasReact = fs.existsSync(serviceReactPath);
    const serviceHasReactDOM = fs.existsSync(serviceReactDOMPath);

    const output = {};

    output.react = serviceHasReact ? serviceReactPath : rootReactPath;
    output['react-dom'] = serviceHasReactDOM ? serviceReactDOMPath : rootReactDOMPath;

    return output;
  },
};
