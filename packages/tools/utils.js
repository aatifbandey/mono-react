const git = require('git-rev-sync');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');


const { ifElse } = require('./lib/logic');
const timestamp = date.getTime();
let gitRevRaw = `latest${timestamp}`;
let gitRevision = JSON.stringify(gitRevRaw);

if (!BUILD_STATELESS) {
  gitRevRaw = git.long();
  gitRevision = JSON.stringify(gitRevRaw);
}


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
  