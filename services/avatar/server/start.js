import config from '@aatif-packages/config';

import app from './index';

const debug = require('debug')('poseidon');
console.log("Test === ",app);
let currentApp = app.callback();
const httpsKey = config.get('HTTPS_KEY_FILE');
const httpsCert = config.get('HTTPS_CERT_FILE');

const useHttps = Boolean(httpsKey && httpsCert);

let server;

if (useHttps) {
  const https = require('https');
  const fs = require('fs');

  server = https.createServer({ key: fs.readFileSync(httpsKey), cert: fs.readFileSync(httpsCert) }, currentApp);
} else {
  const http = require('http');

  server = http.createServer(currentApp);
}

// const HOST = config.get('HOST');
// const PORT = config.get('PORT');

server.listen(3000, err => {
   
  if (err) {
    debug(err);
  } else {
    debug(
      `avatar, the server-side renderer, running at ${useHttps ? 'https' : 'http'}://${HOST}:${PORT} env:${
        process.env.NODE_ENV
      }`,
    );
  }

});

if (module.hot) {
  module.hot.accept('./index', () => {
    server.removeListener('request', currentApp);
    currentApp = app.callback();
    server.on('request', currentApp);
  });
}
