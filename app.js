const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cors = require('koa2-cors');
const jwt = require('koa-jwt');

const routes = require('./routes/index');
const config = require('./routes/config');
const mongodb = config().mongodb;
const secret = config().secret;

// MongoDB connection
mongoose.Promise = bluebird;
mongoose.connect(mongodb, function(err) {
  if(err) {
    console.log('Connect to mongodb err: ' + err.message);
    process.exit(1);
  }
  console.log('Connect to mongodb success.');
})

// jwt
app.use(jwt({secret: secret}).unless({
  path: [/^/, /^\/user\/login/, /^\/user\/register/]
}));

// cors
app.use(cors({
  // origin: function (ctx) {
  //   if (ctx.url === '/test') {
  //     return "*";     // 允许来自所有域名请求
  //   }
  //   return 'http://localhost:8100'; // 这样就能只允许 http://localhost:8100 这个域名的请求了
  // },
  origin: "*",
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 300,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(routes.routes(), routes.allowedMethods())

module.exports = app
