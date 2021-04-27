// module.exports = {
//     presets: ['@babel/preset-env'],
//     plugins: [
    
//       '@babel/plugin-syntax-dynamic-import',
//       ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
//     ],
//     env: {
//       test: {
//         presets: [
//           [
//             '@babel/preset-env',
//             {
//               modules: 'commonjs',
//               debug: false,
//             },
//           ],
//           '@babel/preset-react',
//         ],
//       },
//     },
//   };
  module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
      
      
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
      
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
      ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
    ],
  };