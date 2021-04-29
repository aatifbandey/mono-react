import appRootDir from 'app-root-dir';
import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin';
// import nodeExternals from 'webpack-node-externals';
import config from '@aatif-packages/config';

// import { UnusedFilesWebpackPlugin } from './webpackPlugins';

import { resolve as importResolver } from './import.resolver';
import { isDev, isProd, ifDev, ifProd } from './utils';
import { babelNodeEnvironment } from './babel.options';

const dir = process.env.DIR;

if (!dir) {
  throw new Error('Define directory.');
}

const [serviceName] = dir.split('/');
const log = debug(`build:${serviceName}`);
const publicPath = config.get('PUBLIC_PATH');

const entryPath = `./services/${serviceName}/server/${isDev ? 'start' : 'index'}`;
const buildPath = `./services/${serviceName}/build/server`;

log(`> Cleaning output folder ${buildPath} ...`);
fs.emptyDirSync(buildPath);

log(`> Building ${serviceName}, entry: ${entryPath}, output: ${path.join(buildPath, 'index.js')}`);
const defaultLoaders = [
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    options: babelNodeEnvironment,
  },
];

const fallbackLoader = {
  exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        limit: 1024,
        name: ifDev('[name].[ext]', '[hash:8].[ext]'),
        publicPath,
        emitFile: false,
      },
    },
  ],
};

// const developmentPlugins = () => {
//   if (isDev) {
//     // need to lazy load this plugin
//     const StartServerPlugin = require('start-server-webpack-plugin');

//     return [
//       new StartServerPlugin('index.js'),
//       new webpack.HotModuleReplacementPlugin(),
//       new FriendlyErrorsWebpackPlugin(),
//     ];
//   }

//   return [];
// };

const webpackConfig = {
  /**
   * Output target to NodeJS
   */
  target: 'node',

  /**
   * Fail out if there is a single error in production mode
   */
  bail: isProd,

  /**
   * The base directory
   * for resolving entry point
   */
  context: path.resolve(appRootDir.get(), 'services', serviceName, 'server'),

  /**
   * Define mode to let webpack
   * determine what plugin should be activated
   */
  mode: ifProd('production', 'development'),

  /**
   * Source map setting
   */
  devtool: ifProd('(none)', 'cheap-source-map'),

  /**
   * Define perfomance hints for assets
   * and entrypoints that exceed file limit
   */
  performance: false,

  stats: 'errors-only',

  /**
   * Entry files
   */
  entry: {
    index: [
      /**
       * Polyfills are included here to ensure we can use modern ECMA features
       */
     // '@babel/polyfill',
      'node-fetch',
      ifDev('webpack/hot/poll?1000'),
      path.resolve(appRootDir.get(), entryPath),
    ].filter(Boolean),
  },

  /** Need this to support recompile with HMR */
  watch: isDev,

  /**
   * Output config
   * Buildpath and output name
   */
  output: {
    path: path.resolve(appRootDir.get(), buildPath),
    filename: '[name].js',
    chunkFilename: ifDev('chunk.[name].js', 'chunk.[name].[chunkhash:8].js'),
    publicPath,
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
    alias: importResolver.alias,
    symlinks: true, // this is the default value. Previously we are setting it to false, no idea why
    cacheWithContext: false,
  },

  module: {
    // Makes missing export becomes compile error
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          ...defaultLoaders,
          // fallback loader, any file that doesn't need specific loader use file-loader
          fallbackLoader,
        ],
      },
    ],
  },

  /**
   * We bundle most node_modules into our server bundles partly for runtime perf reason.
   * (https://hashnode.com/post/is-there-any-reason-to-bundle-server-side-code-with-webpack-cja6i7ygs05a5xpwuitg0fu7r)
   *
   * This usually causes webpack build time to be slower though.
   */
  externals: [
    /^\.\/assets\.json$/,
    'koa',
    /^koa-/,
    'log4js',
    /^log4js\//,
    'node-fetch',
    'jsdom',
    /^jsdom\//,



    /* prevent comlink errors on server bundle */
    'comlink',
    /^comlink/,

   
  ],

  optimization: {
    minimize: false,
  },

  plugins: [
    /**
     * Development webpack plugin ... to start webpack SSR server 
     * Won't be enabled in production
     */
    // ...developmentPlugins(),

    /**
     * Define environment variable from process.env
     */
    new webpack.EnvironmentPlugin({
      // use 'development' unless process.env.NODE_ENV is defined
      NODE_ENV: 'development',
    }),

    /**
     * Define variable on build time
     */
    // new webpack.DefinePlugin({
    //   __DEV__: isDev,
    //   __TEST__: false,
    //   __PROD__: isProd,
    //   __CLIENT__: false,
    //   __SERVER__: true,
    //   __GITREV__: gitRevision,
    //   __PUBLIC_PATH__: JSON.stringify(publicPath),
    // }),

    /**
     * Webpack progress plugin to see build progress
     */
    ifDev(new SimpleProgressWebpackPlugin()),

    /**
     * Enable source map on server
     */
    new webpack.BannerPlugin({
      banner: `require("source-map-support").install({ environment: "node" });`,
      raw: true,
      entryOnly: false,
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(appRootDir.get(), 'services', serviceName, '.env.example'),
        to: path.resolve(appRootDir.get(), 'services', serviceName, 'build'),
      },
    ]),
    
  ].filter(Boolean),

  node: false,
};

export { buildPath, defaultLoaders, entryPath, fallbackLoader, serviceName };

export default webpackConfig;
