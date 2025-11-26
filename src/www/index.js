import koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import router from './router.js';


const app = new koa();
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
