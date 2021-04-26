const { execSync } = require('child_process');
const path = require('path');

const { cwd, pcwd } = require('../../lib/path');

const babelBinary = require.resolve('.bin/babel');
// const tscBinary = require.resolve('.bin/tsc');
// const ttscBinary = require.resolve('.bin/ttsc');

const srcPath = 'src';
const outDir = 'dist';

async function build({ dev, types, typesTransformer, copyFiles, withPostbuild }) {
  const timerStart = Date.now();

  const cwdPaths = pcwd.split('/');
  const packageName = `${cwdPaths[cwdPaths.length - 2]}/${cwdPaths[cwdPaths.length - 1]}`;

  async function handler({ isHMR, file, destDir }) {
    try {
      const dest = isHMR ? destDir : outDir;

      const babelCmd = `${babelBinary} ${
        isHMR ? file : srcPath
      } -d ${dest} --extensions '.js,.jsx,.ts,.tsx' --ignore "**/__tests__" --source-maps ${dev ? '--verbose' : ''}`;

      execSync(babelCmd, {
        stdio: 'inherit',
        cwd: pcwd,
      });
    } catch (error) {
      console.error(`❌ Error happened during build process for "${packageName}"\n`);
      console.error(error);
    } finally {
      const timerEnd = Date.now();
      console.log(`ℹ️  Build process finished in ${Math.floor(timerEnd - timerStart)}ms.\n`);
    }

    // if ((types || typesTransformer) && !process.env.SKIP_TS_DECLARATION) {
    //   const timerStartTypes = Date.now();
    //   const tsCli = typesTransformer ? ttscBinary : tscBinary;
    //   try {
    //     // TODO: need to identify on `isHMR` to generate d.ts only spesific files
    //     execSync(`${tsCli} --declarationDir ./dist`, {
    //       stdio: 'inherit',
    //       cwd: pcwd,
    //     });

    //     console.log(`✅ Types for "${packageName}" is successfully transformed.`);
    //   } catch (error) {
    //     console.error(`❌ Error happened during transforming types for "${packageName}"\n`);
    //     console.error(error);
    //   } finally {
    //     const timerEndTypes = Date.now();
    //     console.log(
    //       `ℹ️  Generating types for "${packageName}" finished in ${Math.floor(timerEndTypes - timerStartTypes)}ms.\n`,
    //     );
    //   }
    // }

    // Manually copying unparseable assets by transpiler using "cpy"
    if (copyFiles) {
      const timerStartCopyFiles = Date.now();
      try {
        const cpy = require('cpy');
        const relativeOutDir = path.relative(srcPath, outDir);
        const sourceDir = isHMR ? `${file.replace('src/', '')}` : '**';

        await cpy([sourceDir, `!**/*.{snap,ts,js,tsx,jsx}`], relativeOutDir, {
          cwd: srcPath,
          parents: true,
        });

        console.log(`✅ Successfully copying files to ${packageName}`);
      } catch (error) {
        console.error(`❌ Error happened during copying files to "${packageName}"\n`);
        console.error(error);
      } finally {
        const timerEndCopyFiles = Date.now();
        console.log(
          `ℹ️  Copying files to "${packageName}" finished in ${Math.floor(
            timerEndCopyFiles - timerStartCopyFiles,
          )}ms\n`,
        );
      }
    }

    // // Running post build for pluggables
    // if (withPostbuild) {
    //   const timerStartPostBuild = Date.now();
    //   try {
    //     // make sure it's a pluggable
    //     if (packageName.includes('pluggables')) {
    //       const pluggable = `${cwdPaths[cwdPaths.length - 1]}`;
    //       const postBuildScript = path.resolve('../../scripts/custom-postbuild.js');
    //       // TODO: need to identify on `isHMR` to copy only spesific files
    //       execSync(`node ${postBuildScript} --pluggable=${pluggable} ${dev ? '--dev' : ''}`, {
    //         stdio: 'inherit',
    //         cwd: pcwd,
    //       });

    //       console.log(`✅ Successfully running post build for ${packageName}`);
    //     }
    //   } catch (error) {
    //     console.error(`❌ Error happened during running post build script for "${packageName}"\n`);
    //     console.error(error);
    //   } finally {
    //     const timerEndPostBuild = Date.now();
    //     console.log(
    //       `ℹ️  Generating types for "${packageName}" finished in ${Math.floor(
    //         timerEndPostBuild - timerStartPostBuild,
    //       )}ms.\n`,
    //     );
    //   }
    // }

    const timerEnd = Date.now();
    console.log(`✅ All build process for "${packageName}" finished in ${timerEnd - timerStart}ms\n`);
  }

//   if (dev) {
//     await handler({ isHMR: false });
//     const { watch } = require('chokidar');
//     const watcher = watch([`${pcwd}/src/**/*`], {
//       cwd,
//     });

//     watcher.on('ready', () => {
//       watcher.on('all', async (event, file) => {
//         // NOT triggerred on remove file, just log to console
//         if (event !== 'unlink') {
//           console.log(`\n🔁 Rebuilding on event: "${event}", file: "${file}"...`);
//           let destDir = outDir;
//           // make sure it's src
//           if (file.includes('src/')) {
//             destDir = file.replace(`src/`, `${outDir}/`).substring(0, file.lastIndexOf('/') + 1);
//             console.log(`🔁 Destination directory: ${destDir}\n`);
//             await handler({ isHMR: true, file, destDir });
//           }
//         } else {
//           console.warn(`\n⚠️ Skip rebuilding file on event: "${event}", file: "${file}"...\n`);
//         }
//       });
//     });
//   } else {
    await handler({ isHMR: false });
  //}
}

module.exports = build;
