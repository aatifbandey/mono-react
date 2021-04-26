import path from 'path';
import appRootDir from 'app-root-dir';

import config from '@aatif-packages/config';
import { ifDev } from '@aatif-packages/tools/utils';

import LoadableWebpackPlugin from '@loadable/webpack-plugin';
import webpackConfig, { defaultLoaders, fallbackLoader } from '@aatif-packages/tools/webpack.client.config';
import { WriteFilePlugin } from '@aatif-packages/tools/webpackPlugins';
import { resolve as importResolver } from '../import.resolver';

const publicPath = config.get('PUBLIC_PATH');
const dir = process.env.DIR;
const buildStaticPath = path.resolve(appRootDir.get(), './services', './avatar', `./build/static`);

webpackConfig.resolve.alias = importResolver.alias;

webpackConfig.entry = {
  main: [ifDev('react-hot-loader/patch'), path.resolve(appRootDir.get(), 'services', dir, 'index.js')].filter(Boolean),
};

webpackConfig.module.rules[0].oneOf = [
  ...defaultLoaders,
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    use: [
      {
        loader: require('@aatif-packages/tools/loaders')['file-loader'],
        options: {
          limit: 1024,
          name(file) {
            if (file.indexOf('offline-image') > -1) {
              // keep the name of this image, so we can precache them using workbox
              return ifDev('[name].[ext]', '[name].[hash:8].[ext]');
            }

            return ifDev('[name].[ext]', '[hash:8].[ext]');
          },
          publicPath,
        },
      },
    ],
  },
  fallbackLoader,
];
// another bundle for framework stuffs (react, react-dom)
// to load the resources quickly

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  new LoadableWebpackPlugin({
    writeToDisk: true,
  }),
  new WriteFilePlugin({
    data: () => new Date().getTime(),
    dest: path.join(buildStaticPath, 'build.timestamp.json'),
    operationName: 'Write the timestamp of this webpack build to build.timestamp.json to be used later.',
  }),

];

export default webpackConfig;
