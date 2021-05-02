import config from '@aatif-packages/config';
import { ifDev, isDev, isProd  } from '../lib';

import { babelNodeEnvironment } from '@aatif-packages/tools/babel.options';
import webpackConfig, { defaultLoaders } from '@aatif-packages/tools/webpack.server.config';

import { resolve as importResolver } from '../import.resolver';


webpackConfig.resolve.alias = {
  ...importResolver.alias,
  // $getUsedConstants: path.resolve(appRootDir.get(), './services/avatar/client/constants/getUsedConstants/server.js'),
};

webpackConfig.module.rules[0].oneOf = [
  {
    test: /\.jsx?$/,
    exclude: defaultLoaders[0].exclude,
    loader: require('@aatif-packages/tools/loaders')['babel-loader'],
    options: {
      ...babelNodeEnvironment,
      presets: [
        ...babelNodeEnvironment.presets,
        [require('@aatif-packages/tools/babelPlugins')['@babel/preset-react'], { development: isDev, useBuiltIns: true }],
      ],
      plugins: [
        ...babelNodeEnvironment.plugins,
        // require('@aatif-packages/tools/babelPlugins')['@loadable/babel-plugin'],
        [
          require('@aatif-packages/tools/babelPlugins')['babel-plugin-emotion'],
          { autoLabel: isDev, hoist: isProd, sourceMap: isDev },
        ],
      ],
    },
  },
  
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    use: [
      {
        loader: require('@aatif-packages/tools/loaders')['url-loader'],
        options: {
          limit: 1024,
          emitFile: false,
        },
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    use: [
      {
        loader: require('@aatif-packages/tools/loaders')['file-loader'],
        options: {
          limit: 1024,
          name: ifDev('[name].[ext]', '[hash:8].[ext]'),
          publicPath: config.get('PUBLIC_PATH'),
          emitFile: false,
        },
      },
    ],
  },
  // use base config loader exclude babel-loader
  ...webpackConfig.module.rules[0].oneOf.slice(1),
];

export default webpackConfig;
