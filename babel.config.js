
  module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
      
    ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
      
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
      ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
    ],
  };