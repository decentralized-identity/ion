import * as getRawBody from 'raw-body';
import * as Koa from 'koa';
import * as Router from 'koa-router';

import {
  ISidetreeResponse,
  SidetreeIpfsService,
  SidetreeResponse
} from '@decentralized-identity/sidetree';

const config: {
  /** Port number used by the service. */
  port: number;
  /** Timeout for fetch request. */
  fetchTimeoutInSeconds: number;
} = require('../json/ipfs-config.json');

const requestHandler = new SidetreeIpfsService(config.fetchTimeoutInSeconds);
const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();

router.get('/:hash', async (ctx, _next) => {
  const response = await requestHandler.handleFetchRequest(ctx.params.hash, ctx.query['max-size']);
  setKoaResponse(response, ctx.response, 'application/octet-stream');
});

router.post('/', async (ctx, _next) => {
  const response = await requestHandler.handleWriteRequest(ctx.body);
  setKoaResponse(response, ctx.response);
});

app.use(router.routes())
   .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});
const port = config.port;

const server = app.listen(port, () => {
  console.log(`Sidetree-IPFS node running on port: ${port}`);
})
.on('error', (e) => {
  console.error(`${e.message} on starting Sidetree-IPFS service`);
});

// Listen for graceful termination
process.on('SIGTERM', () => {
  requestHandler.ipfsStorage.stop();
  process.exit();
});
process.on('SIGINT', () => {
  requestHandler.ipfsStorage.stop();
  process.exit();
});
process.on('SIGHUP', () => {
  requestHandler.ipfsStorage.stop();
  process.exit();
});
process.on('uncaughtException', () => {
  requestHandler.ipfsStorage.stop();
  process.exit();
});

/**
 * Sets the koa response according to the Sidetree response object given.
 * @param response Response object fetched from request handler.
 * @param koaResponse Koa Response object to be filled
 * @param contentType Content type to be set for response, defaults to application/json
 */
const setKoaResponse = (response: ISidetreeResponse, koaResponse: Koa.Response, contentType?: string) => {
  koaResponse.status = SidetreeResponse.toHttpStatus(response.status);
  if (contentType) {
    koaResponse.set('Content-Type', contentType);
  } else {
    koaResponse.set('Content-Type', 'application/json');
  }

  if (response.body) {
    koaResponse.body = response.body;
  } else {
    // Need to set the body explicitly, otherwise Koa will return HTTP 204.
    koaResponse.body = '';
  }
};

module.exports = server;
