// import crypto from 'crypto';
// import path from 'path';
// import fs from 'fs';
import config from '@aatif-packages/config';
import url from 'url';
// import Terser from 'terser';
// import transformConstants from '../../client/constants/transformConstants';
import { getHeader, getFooter } from '../renderer/html-template';

// const transformRegexArray = array => array.map(v => new RegExp(v));

// const PUBLIC_PATH_REGEX = config.get('PUBLIC_PATH_REGEX');
const configConstants = config.getConstants();
// const { SW_EXCLUDE_ARRAY } = configConstants;
// const swExcludeRegexArray = transformRegexArray(SW_EXCLUDE_ARRAY);

// on staging and prod, this path is relative to where our built files will be located
// which is: /build/server/index.js
// const staticPath = __DEV__ ? '../../build/static' : '../static';

// these two variables are declared in the outermost scope so we can do memoization
// let serviceWorkerJsBody;
let swShellBody;

/**
 * This function will generate the responses for service-worker.js and sw-shell requests
 * On dev, we expect this function to run on every request
 * On prod, we expect this function to run only on server start/restart
 *
 * @returns {String} The string of the current revision
 */
const generateResponses = () => {
//   const buildTimestamp = fs.readFileSync(path.resolve(__dirname, staticPath, './build.timestamp.json'));
//   const offlineShellPath = fs.readFileSync(path.resolve(__dirname, staticPath, './offline-shell-path.json'));
//   const swWorkboxText = fs.readFileSync(path.resolve(__dirname, staticPath, './service-worker-workbox.js'));

//   const constants = transformConstants(configConstants);
//   const constantsHash = crypto
//     .createHash('sha256')
//     .update(JSON.stringify(constants))
//     .digest('hex')
//     .slice(0, 16);
//   const revision = `${buildTimestamp}_${constantsHash}`;

//   serviceWorkerJsBody = `
// const VERSION = "${revision}";
// const PUBLIC_PATH_REGEX = "${PUBLIC_PATH_REGEX}";
// const OFFLINE_SHELL_PATH = "${offlineShellPath}";
// const BLACKLISTED_ROUTES = [${swExcludeRegexArray.join(', ')}];
// ${swWorkboxText}
// ${__DEV__ ? 'workbox.core.skipWaiting();workbox.core.clientsClaim();' : ''}
// `.trim();

//   serviceWorkerJsBody = __DEV__
//     ? serviceWorkerJsBody
//     : Terser.minify(serviceWorkerJsBody, {
//         ecma: 5,
//         mangle: {
//           safari10: true,
//         },
//         output: {
//           ascii_only: true,
//         },
//       }).code;

  swShellBody = `${getHeader()}${getFooter()}`;

  // return the revision string
//   return revision;
};

/**
 * This function generates an express middleware to be used by webpack-dev-server
 * On prod, we should convert this to a koa middleware using koa-connect (https://github.com/vkurchatkin/koa-connect)

 * ATTENTION!
 * We INTENTIONALLY do not use any of the express-specific API here,
 * so that this middleware can be converted correctly.
 * Example of express-specific API:
 * - res.send()
 *
 * When modifying this file, only use APIs available in native node http
 * https://nodejs.org/api/http.html
 */
export default () => {
//   const milliseconds7Days = 7 * 24 * 60 * 60 * 1000;
//   const swShellNameRegexp = /^\/p\/sw-shell\.[\w_-]+\.html$/;
  let revision;

  if (!__DEV__) {
    // on prod, we only generate responses once, on server start/restart
    revision = generateResponses();
  }

  return async (req, res, next) => {
    if (__DEV__) {
      // generate responses for every request on dev, to support hot reloading
      revision = generateResponses();
    }
    console.log(swShellBody);
    const { pathname: requestPath } = url.parse(req.url);
   
    if (__DEV__) {
      if (requestPath === '/index.html') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.end(swShellBody);

        return;
      }
    }

    // if (swShellNameRegexp.test(requestPath)) {
    //   const requestCheckETag = req.headers['if-none-match'];

    //   if (requestCheckETag === `W/"${revision}"`) {
    //     res.statusCode = 304;

    //     res.setHeader('Content-Type', 'text/html');
    //     // res.setHeader('Access-Control-Allow-Origin', '*');
    //     // res.setHeader(
    //     //   'access-control-allow-headers',
    //     //   'Content-type, Fingerprint-Data, x-user-id, Webview-App-Version, Redirect, Access-Control-Allow-Origin, Content-MD5, Tkpd-UserId, X-Tkpd-UserId, Tkpd-SessionId, X-Device, X-Source, X-Method, X-Date, Authorization, Accounts-Authorization, flight-thirdparty, x-origin, Cshld-SessionID, X-Mitra-Device, x-tkpd-akamai, x-tkpd-lite-service, x-ga-id, Akamai-Bot, x-tkpd-app-name, x-tkpd-clc',
    //     // );
    //     // res.setHeader('access-control-allow-credentials', 'true');
    //     res.setHeader('X-poseidon-Shell-Cacheable', 'true');
    //     res.setHeader('X-poseidon-Shell-Expiry-Timestamp', new Date().getTime() + milliseconds7Days);
    //     res.setHeader('Cache-Control', 'no-cache');
    //     res.setHeader('ETag', `W/"${revision}"`);

    //     res.end();

    //     return;
    //   }

    //   res.statusCode = 200;
    //   res.setHeader('Content-Type', 'text/html');
    //   // res.setHeader('Access-Control-Allow-Origin', '*');
    //   // res.setHeader(
    //   //   'access-control-allow-headers',
    //   //   'Content-type, Fingerprint-Data, x-user-id, Webview-App-Version, Redirect, Access-Control-Allow-Origin, Content-MD5, Tkpd-UserId, X-Tkpd-UserId, Tkpd-SessionId, X-Device, X-Source, X-Method, X-Date, Authorization, Accounts-Authorization, flight-thirdparty, x-origin, Cshld-SessionID, X-Mitra-Device, x-tkpd-akamai, x-tkpd-lite-service, x-ga-id, Akamai-Bot, x-tkpd-app-name, x-tkpd-clc',
    //   // );
    //   // res.setHeader('access-control-allow-credentials', 'true');
    //   // res.setHeader('accept', 'text/html');

    //   res.setHeader('X-poseidon-Shell-Cacheable', 'true');
    //   res.setHeader('X-poseidon-Shell-Expiry-Timestamp', new Date().getTime() + milliseconds7Days);
    //   res.setHeader('Cache-Control', 'no-cache'); // tells browser to always have to revalidate
    //   res.setHeader('ETag', `W/"${revision}"`); // if this value is the same with the one in browser HTTP cache, it will be marked as valid

    //   res.end(swShellBody);

    //   return;
    // }

    // if (requestPath === '/p/service-worker.js') {
    //   res.setHeader('Content-Type', 'application/javascript');
    //   res.statusCode = 200;

    //   res.end(serviceWorkerJsBody);

    //   return;
    // }

    await next();
  };
};
