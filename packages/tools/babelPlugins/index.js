// re-exports plugins here to be used from service webpack.config
module.exports = {
    
    '@loadable/babel-plugin': require.resolve('@loadable/babel-plugin'),
    '@babel/preset-react': require.resolve('@babel/preset-react'),
    '@babel/preset-env': require.resolve('@babel/preset-env'),
    'babel-plugin-emotion': require.resolve('babel-plugin-emotion'),
  };