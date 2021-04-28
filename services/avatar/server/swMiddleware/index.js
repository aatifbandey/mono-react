
import url from 'url';
import { getHeader, getFooter } from '../renderer/html-template';

let swShellBody;


const generateResponses = () => {

  swShellBody = `${getHeader()}${getFooter()}`;


};


export default () => {

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
   
    const { pathname: requestPath } = url.parse(req.url);
   
    if (__DEV__) {
      if (requestPath === '/index.html') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.end(swShellBody);

        return;
      }
    }

    await next();
  };
};
