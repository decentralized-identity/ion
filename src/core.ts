import * as getRawBody from 'raw-body';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  ISidetreeConfig,
  ISidetreeProtocolParameters,
  ISidetreeResponse,
  SidetreeCore,
  SidetreeResponse
} from '@decentralized-identity/sidetree';

/** Configuration used by this server. */
interface IServerConfig extends ISidetreeConfig {
  /** Port to be used by the server. */
  port: number;
}

const config: IServerConfig = require('../json/core-config.json');
const versionsOfProtocolParameters: ISidetreeProtocolParameters[] = require('../json/core-protocol-parameters.json');

const sidetreeCore = new SidetreeCore(config, versionsOfProtocolParameters);
const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();
router.post('/', async (ctx, _next) => {
  const response = await sidetreeCore.requestHandler.handleOperationRequest(ctx.body);
  setKoaResponse(response, ctx.response);
});

router.get('/:didOrDidDocument', async (ctx, _next) => {
  const response = await sidetreeCore.requestHandler.handleResolveRequest(ctx.params.didOrDidDocument);
  setKoaResponse(response, ctx.response);
});

app.use(router.routes())
   .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

sidetreeCore.initialize()
.then(() => {
  const port = config.port;
  app.listen(port, () => {
    console.log(`Sidetree node running on port: ${port}`);
  });
})
.catch((error: Error) => {
  console.log(`Sidetree node initialization failed with error ${error}`);
});

/**
 * Sets the koa response according to the Sidetree response object given.
 */
const setKoaResponse = (response: ISidetreeResponse, koaResponse: Koa.Response) => {
  koaResponse.status = SidetreeResponse.toHttpStatus(response.status);

  if (response.body) {
    koaResponse.set('Content-Type', 'application/json');
    koaResponse.body = response.body;
  } else {
    // Need to set the body explicitly to empty string, else koa will echo the request as the response.
    koaResponse.body = '';
  }
};
