/**
 * This file resolves the entry assets available from our client bundle.
 */

import fs from 'fs';
import path from 'path';
import appRootDir from 'app-root-dir';

const resultCache = {};

/**
 * Retrieves the js/css for the named chunks that belong to our client bundle.
 
 */
export default function getClientAssets(service, filename = './assets.json') {
  let baseDir = `./services/${service}/build/client`;

  if (process.env.NODE_ENV !== 'development') {
    baseDir = `./client`;
  }

  // Return the assets json cache if it exists.
  // In development mode we always read the assets json file from disk to avoid
  // any cases where an older version gets cached.
  if (process.env.NODE_ENV !== 'development' && resultCache[filename]) {
    return resultCache[filename];
  }

  const assetsPath = path.resolve(appRootDir.get(), baseDir, filename);

  if (!fs.existsSync(assetsPath)) {
    throw new Error(
      `We could not find the "${assetsPath}" file, which contains a list of the assets of the client bundle.  Please ensure that the client bundle has been built.`,
    );
  }

  const readAssetsFile = () => JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
  const assetsJson = readAssetsFile();

  if (typeof assetsJson === 'undefined') {
    throw new Error('No asset data found for client bundle.');
  }

  resultCache[filename] = assetsJson;

  return resultCache[filename];
}
