require("@babel/register");
import appRootDir from 'app-root-dir';
import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import cssnano from 'cssnano';
import AssetsPlugin from 'assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin';
import safeParser from 'postcss-safe-parser';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import config from '@aatif-packages/config';
import { gitRevision, isDev, isProd, ifDev, ifProd, lessLoaders } from './utils';

import { babelClientEnvironment } from './babel.options';

const dir = process.env.DIR;
const publicPath = config.get('PUBLIC_PATH');

if (!dir) {
  throw new Error('Define directory.');
}

const shouldAnalyze = Boolean(process.env.ANALYZE_BUNDLE);
const [serviceName] = dir.split('/');
const log = debug(`build:${serviceName}`);

const buildPath = `./services/${serviceName}/build/client`;
const buildStaticPath = `./services/${serviceName}/build/static`;

// Make sure build path is exist, if not create it
// Disable clean build forlder for dionisos (microsites), repack existing and new files
// This condition moved to dionisos webpack config
if (serviceName !== 'dionisos') {
  log(`> Cleaning output folder ${buildPath} ...`);
  fs.emptyDirSync(path.resolve(appRootDir.get(), buildPath));

  log(`> Cleaning output folder ${buildStaticPath} ...`);
  fs.emptyDirSync(path.resolve(appRootDir.get(), buildStaticPath));
}

if (isDev) {
  log(`> Copying static file...`);
  fs.copy(path.resolve(appRootDir.get(), 'services', serviceName, 'static'), path.resolve(appRootDir.get(), buildPath));
}

const defaultLoaders = [
  {
    test: /\.jsx?$/,
    use: [
      {
        loader: require.resolve('thread-loader'),
      },
      {
        loader: require.resolve('babel-loader'),
        options: babelClientEnvironment,
      },
    ],
  },
  
  {
    test: /\.less$/,
    exclude: /node_modules/,
    use: lessLoaders({ paths: [path.resolve(appRootDir.get(), 'services', dir, 'styles')] }),
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 1024,
        },
      },
    ],
  },
  
];

const fallbackLoader = {
  exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
  use: [
    {
      loader: require.resolve('file-loader'),
      options: {
        limit: 1024,
        name: ifDev('[name].[ext]', '[hash:8].[ext]'),
        publicPath,
      },
    },
  ],
};

const webpackConfig = {
  /**
   * Output target to web
   */
  target: 'web',

  /**
   * Fail out if there is a single error in production mode
   */
  bail: isProd,

  /**
   * The base directory
   * for resolving entry point
   */
  context: path.resolve(appRootDir.get(), 'services', dir),

  /**
   * Define mode to let webpack
   * determine what plugin should be activated
   */
  mode: ifProd('production', 'development'),

  /**
   * Source map setting. On prod, will be handled by webpack.SourceMapDevToolPlugin, so we set this to false
   */
  devtool: ifDev('cheap-module-source-map', false),

  /**
   * Entry files
   * Use custom polyfills
   */
  entry: {
    mobile: [
      ifDev(require.resolve('react-hot-loader/patch')),
      path.resolve(appRootDir.get(), 'services', dir, 'index.js'),
    ].filter(Boolean),
  },

  /**
   * Output config
   * Buildpath and output name
   */
  output: {
    path: path.resolve(appRootDir.get(), buildPath),
    publicPath,
    filename: ifDev('[name].js', '[name].[contenthash].js'),
    chunkFilename: ifDev('chunk.[name].js', 'chunk.[name].[contenthash].js'),
    crossOriginLoading: 'anonymous',
    globalObject: ifDev('this', 'window'), // on dev we set to 'this' to handle comlink-loader bug. Until we can move to worker-plugin
  },

  /**
   * Webpack 4 configuration
   * Auto minified in production, auto common chunk
   * the default is production
   */
  optimization: {
    // extracts webpack's boilerplate to its own chunk, so all other chunks can be consistent between builds
    // allows better caching for the browsers
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      maxInitialRequests: 10,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          filename: ifDev('vendor.js', 'vendor.[contenthash].js'),
        },
        framework: {
          test: /[\\/]node_modules.*(react|react-dom|react-router|emotion|react-emotion|@loadable)\//,
          chunks: 'initial',
          filename: ifDev('framework.js', 'framework.[contenthash].js'),
          priority: 9,
        },
        packages: {
          test: /packages/,
          chunks: 'initial',
          filename: ifDev('packages.js', 'packages.[contenthash].js'),
          priority: 1,
        },
      },
    },
    minimizer: ifProd([
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 5,
          mangle: {
            safari10: true,
          },
          output: {
            ascii_only: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          parser: safeParser,
        },
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: false,
      }),
    ]),
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
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
      // Used to enable source maps from 3rd party node_modules
      ifProd(
        {
          test: /\.js$/,
          use: [require.resolve('source-map-loader')],
          enforce: 'pre',
        },
        null,
      ),
    ].filter(Boolean),
  },

  plugins: [
    // ifProd(new SourceMapPlugin(serviceName)),
    /**
     * Define environment variable from process.env
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DIR: serviceName,
    }),

    /**
     * Default plugin
     * Used in all environtment
     * DefinePlugin, CommonsChunkPlugin, AssetsPlugin
     */
    new webpack.DefinePlugin({
      __DEV__: isDev,
      __TEST__: false,
      __PROD__: isProd,
      __CLIENT__: true,
      __SERVER__: false,
      // __DEVTOOLS__: isVerbose, 
      __GITREV__: gitRevision,
      __PUBLIC_PATH__: JSON.stringify(publicPath),
    }),

    /**
     * Webpack progress plugin to see build progress
     */
    ifDev(new SimpleProgressWebpackPlugin()),

    /**
     * Extract asset pathname
     */
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.resolve(appRootDir.get(), buildPath),
    }),

    /**
     * Copy static assets
     * These copied folders will be deployed to S3 (Tokopedia CDN)
     */
    new CopyWebpackPlugin([
      {
        from: path.resolve(appRootDir.get(), 'services', serviceName, 'static'),
        to: path.resolve(appRootDir.get(), buildPath, '../static'),
        flatten: true,
      },
    ]),

    shouldAnalyze
      ? new BundleAnalyzerPlugin({
          analyzerMode: 'static', // outputs an HTML file
          openAnalyzer: false,
          generateStatsFile: true,
          reportFilename: path.resolve(appRootDir.get(), 'services', serviceName, './build/static/bundle-analyze.html'),
        })
      : null,

    /**
     * Webpack production plugin
     * These plugin only used in production env.
     */
    ifProd(
      new MiniCssExtractPlugin({
        filename: ifDev('[name].css', '[name].[hash].css'),
        chunkFilename: ifDev('[id].css', '[id].[hash].css'),
      }),
    ),
   
  ].filter(Boolean),

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

export { buildPath, defaultLoaders, fallbackLoader, serviceName };

export default webpackConfig;
