const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let arraySubscribersResolve = [];

router.get('/subscribe', async (ctx, next) => {
  console.log('get request');
  const promise = new Promise((resolve, reject) => {
    arraySubscribersResolve.push(resolve);
    console.log(resolve);
    ctx.res.on("close", function () {
      arraySubscribersResolve.splice(arraySubscribersResolve.indexOf(resolve), 1);
      const error = new Error("Connection closed");
      error.code = "ECONNRESET";
      reject(error);
    });
  });
    
  let message;
    
  try {
    message = await promise;
  } catch (err) {
    if (err.code === "ECONNRESET") return;
    throw err;
  }
    
  // console.log('DONE', message);
  ctx.body = message;
});
/*
router.options('/publish', async (ctx, next) => {
  //ctx.header
  //ctx.
  //ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000/publish');
  ctx.set('Access-Control-Allow-Origin', '*');
  //ctx.set('Access-Control-Allow-Origin', 'file:///D:/WORKSPACES/WEBTST/LEARNJS/NODESRV/koaEx/index.html');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  console.log('router.options/publish');
  ctx.body = 'ok';
  
});

router.post('/publish', async (ctx, next) => {
  console.log('router.get/subscribe');
  ctx.set('Access-Control-Allow-Origin', '*');
  //ctx.set('Access-Control-Allow-Origin', 'file:///D:/WORKSPACES/WEBTST/LEARNJS/NODESRV/koaEx/index.html');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  console.log('router.post/publish = ', ctx.request.body);
  console.log('router.post/publish message = ', ctx.request.body.message);
  //let message = 
  arraySubscribersResolve.forEach((resolve) => resolve(ctx.request.body.message));
  arraySubscribersResolve = [];
  //console.log(ctx.request.body);
  //console.log(ctx.req);
  //ctx.body = 'ok';
  ctx.body = null;
});
*/
router.post('/publish', async (ctx, next) => {
    console.log('post request');
    const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

  arraySubscribersResolve.forEach(function (resolve) {
    resolve(String(message));
  });

  arraySubscribersResolve = [];

  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
