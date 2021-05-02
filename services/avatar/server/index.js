

import Koa from 'koa';



import renderer from './renderer';

const debug = require('debug')('poseidon');

debug('Starting...');
const app = new Koa();



app.use(renderer);

export default app;
