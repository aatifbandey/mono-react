const { isDev, isProd, ifDev } = require('./utils');

const babelClientEnvironment = {
    root: __dirname,
    babelrc: false,
    cacheDirectory: true,
    cacheCompression: isProd,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        { modules: false, useBuiltIns: 'entry', corejs: '2', exclude: ['es6.promise', 'es7.promise.finally'] },
      ],
      [require.resolve('@babel/preset-react'), { development: isDev, useBuiltIns: true }],
    ],
    plugins: [
      require.resolve('babel-plugin-macros'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      [require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-syntax-async-generators'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
      [require.resolve('@babel/plugin-transform-runtime'), { helpers: false, regenerator: true }],
      require.resolve('babel-plugin-lodash'),
     
      [require.resolve('babel-plugin-emotion'), { autoLabel: isDev, hoist: isProd, sourceMap: isDev }],
      ifDev(require.resolve('react-hot-loader/babel')),
      ifDev(require.resolve('babel-plugin-console')),
    ].filter(Boolean),
    env: {
      production: {
        plugins: [
          [
            require.resolve('babel-plugin-transform-react-remove-prop-types'),
            {
              mode: 'remove',
              removeImport: true,
              additionalLibraries: ['prop-types-extra'],
              ignoreFilenames: ['node_modules'],
            },
          ],
        ],
      },
    },
  };

  const babelNodeEnvironment = {
    babelrc: false,
    cacheDirectory: true,
    cacheCompression: isProd,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            node: true,
          },
          modules: 'commonjs',
          useBuiltIns: 'entry',
        },
      ],
    ],
    plugins: [
      require.resolve('babel-plugin-macros'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      [require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-syntax-async-generators'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
      [require.resolve('@babel/plugin-transform-runtime'), { helpers: false, regenerator: true }],
      ifDev(require.resolve('babel-plugin-console')),
      require.resolve('babel-plugin-lodash'),
    ].filter(Boolean),
    env: {
      production: {
        plugins: [
          [
            require.resolve('babel-plugin-transform-react-remove-prop-types'),
            {
              mode: 'remove',
              removeImport: true,
              additionalLibraries: ['prop-types-extra'],
              ignoreFilenames: ['node_modules'],
            },
          ],
          require.resolve('@babel/plugin-transform-react-constant-elements'),
          require.resolve('@babel/plugin-transform-react-inline-elements'),
        ],
      },
    },
  };

  module.exports = {
    babelClientEnvironment,
    babelNodeEnvironment
  }