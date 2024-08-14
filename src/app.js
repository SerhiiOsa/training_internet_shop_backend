require("dotenv").config();
const Koa = require('koa');
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const koaStatic = require('koa-static');
const router = require('./routes')
const errorHandler = require('./middleware/errorHandler');
const { corsOptions } = require('../config');
const startServer = require('../server');

const app = new Koa();

app.use(koaStatic('public'));
app.use(errorHandler);
app.keys = [process.env.APP_KEY]
app.use(cors(corsOptions));
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

startServer(app);