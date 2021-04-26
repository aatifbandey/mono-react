module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
    
      '@babel/plugin-syntax-dynamic-import',
      
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'commonjs',
              debug: false,
            },
          ],
          '@babel/preset-react',
        ],
      },
    },
  };