
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssPresetEnv from 'postcss-preset-env';

import { ifElse } from './lib/logic';
const date = new Date();

const timestamp = date.getTime();
let gitRevRaw = `latest${timestamp}`;
let gitRevision = JSON.stringify(gitRevRaw);



const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);

const lessLoaders = ({ isClient = true, paths } = {}) => [
    ifDev(require.resolve('style-loader'), MiniCssExtractPlugin.loader),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        exportOnlyLocals: !isClient,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        plugins: () => [postcssPresetEnv({ stage: 2 })],
      },
    },
    {
      loader: require.resolve('less-loader'),
      options: {
        paths,
      },
    },
  ];

module.exports = {
    gitRevRaw,
    gitRevision,
    
    ifDev,
    ifProd,

    isDev,
    isProd,
    
    lessLoaders,
  };
  