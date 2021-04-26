#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .command(
    'build-package',
    'Build package',
    c => {
      return c.options({
        // dev: {
        //   describe: 'Build your package in development mode, with watch',
        // },
        // esbuild: {
        //   describe: 'Use esbuild as your compiler instead of babel.',
        // },
        // format: {
        //   describe: 'Which format should esbuild compile to: cjs, iife, esm (default).',
        // },
        'copy-files': {
          describe: 'Tell the cli to copy over all the unparsable assets e.g. .png, .graphql',
        },
        // types: {
        //   describe: 'Build your package declaration files (*.d.ts)',
        // },
        // 'types-transformer': {
        //   describe: 'Build your package declaration files (*.d.ts) and transform module path in declaration files',
        // },
        // 'with-postbuild': {
        //   describe: 'Tell the cli to run the "custom-postbuild" script, usually for the pluggable',
        // },
        // 'babel-transformer': {
        //   describe: 'Only applicable with --esbuild flag, use babel to transform loadable & lodash',
        // },
      });
    },
    argv => {
    //   if (argv.esbuild) {
    //     require('./cli/esbuild/packager')({
    //       dev: argv.dev,
    //       format: argv.format,
    //       copyFiles: argv['copy-files'],
    //       types: argv.types,
    //       typesTransformer: argv['types-transformer'],
    //       babelTransformer: argv['babel-transformer'],
    //       withPostbuild: argv['with-postbuild'],
    //     });
    //     return;
    //   }

      require('./cli/build-package')({
        dev: argv.dev,
        types: argv.types,
        typesTransformer: argv['types-transformer'],
        copyFiles: argv['copy-files'],
        withPostbuild: argv['with-postbuild'],
      });
    },
  )
//   .command(
//     'esbuild',
//     'Build with esbuild as a bundler.',
//     c => {
//       return c.options({
//         dev: {
//           describe: 'Build your package in development mode, with watch',
//         },
//         types: {
//           describe: 'Build your package declaration files (*.d.ts)',
//         },
//         'types-transformer': {
//           describe: 'Build your package declaration files (*.d.ts) and transform module path in declaration files',
//         },
//         'babel-transformer': {
//           describe: 'Use babel to transform loadable & lodash.',
//         },
//       });
//     },
//     argv => {
//       require('./cli/esbuild/bundler')({
//         dev: argv.dev,
//         types: argv.types,
//         typesTransformer: argv['types-transformer'],
//         babelTransformer: argv['babel-transformer'],
//       });
//     },
//   )
  .demandCommand(1, 'Please choose your command')
  .epilog('Lite Tools CLI')
  .help()
  .strict()
  .parse();
