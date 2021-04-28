import Koa from 'koa';
import renderer from './renderer';

const app = new Koa()
console.log("Kin")
app.use(renderer);

