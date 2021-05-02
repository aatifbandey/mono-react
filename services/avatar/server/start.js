const config = require('@aatif-packages/config');

import app from './index';

const debug = require('debug')('poseidon');

let currentApp = app.callback();
// const httpsKey = config.get('HTTPS_KEY_FILE');
// const httpsCert = config.get('HTTPS_CERT_FILE');

//  const useHttps = Boolean(httpsKey && httpsCert);
const useHttps = false;
let server;

if (useHttps) {
  const https = require('https');
  const fs = require('fs');

  server = https.createServer({ key: fs.readFileSync(httpsKey), cert: fs.readFileSync(httpsCert) }, currentApp);
} else {
  const http = require('http');
	console.log(currentApp);
	server = http.createServer(currentApp)
	// server = http.createServer(function (req, res) {
	// 	res.writeHead(200, {'Content-Type': 'text/plain'});
	// 	res.write('Hello World!');
	// 	res.end();
	// })
	
}

const HOST = config.get('HOST');
const PORT = config.get('PORT');

server.listen(PORT, err => {
    console.log("Port number", 3000)
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
