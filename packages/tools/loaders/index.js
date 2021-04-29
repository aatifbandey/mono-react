// re-exports loaders here to be used from service webpack.config
module.exports = {
    'thread-loader': require.resolve('thread-loader'),
    'babel-loader': require.resolve('babel-loader'),
    'file-loader': require.resolve('file-loader'),
    'source-map-loader': require.resolve('source-map-loader'),
    'url-loader': require.resolve('url-loader'),
    'style-loader': require.resolve('style-loader'),
    'css-loader': require.resolve('css-loader'),
    'postcss-loader': require.resolve('postcss-loader'),
  };
  