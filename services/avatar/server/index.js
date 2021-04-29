import Koa from 'koa';

// import serve from '@lite/koa-middlewares/serve';


import renderer from './renderer';

const debug = require('debug')('poseidon');

debug('Starting...');
const app = new Koa();


if (__DEV__) {
 

  // app.use(serve('../client'));
}

app.use(renderer);


export default app;
