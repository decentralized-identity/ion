import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as getRawBody from 'raw-body';
import {
  SidetreeConfig,
  SidetreeCore,
  SidetreeResponse,
  SidetreeResponseModel,
  SidetreeVersionModel
} from '@decentralized-identity/sidetree';
import Ipfs from '@decentralized-identity/sidetree/dist/lib/ipfs/Ipfs';
import LogColor from '../bin/LogColor';
import ResponseStatus from '@decentralized-identity/sidetree/dist/lib/common/enums/ResponseStatus';

/** Configuration used by this server. */
interface ServerConfig extends SidetreeConfig {
  /** IPFS HTTP API endpoint URI. */
  ipfsHttpApiEndpointUri: string;

  /** Port to be used by the server. */
  port: number;
}

// Selecting core config file, environment variable overrides default config file.
let configFilePath = '../json/testnet-core-config.json';
if (process.env.ION_CORE_CONFIG_FILE_PATH === undefined) {
  console.log(LogColor.yellow(`Environment variable ION_CORE_CONFIG_FILE_PATH undefined, using default core config path ${configFilePath} instead.`));
} else {
  configFilePath = process.env.ION_CORE_CONFIG_FILE_PATH;
  console.log(LogColor.lightBlue(`Loading core config from ${LogColor.green(configFilePath)}...`));
}
const config: ServerConfig = require(configFilePath);

// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../json/testnet-core-versioning.json';
if (process.env.ION_CORE_VERSIONING_CONFIG_FILE_PATH === undefined) {
  console.log(LogColor.yellow(
    `Environment variable ION_CORE_VERSIONING_CONFIG_FILE_PATH undefined, using default core versioning config path ${versioningConfigFilePath} instead.`
  ));
} else {
  versioningConfigFilePath = process.env.ION_CORE_VERSIONING_CONFIG_FILE_PATH;
  console.log(LogColor.lightBlue(`Loading core versioning config from ${LogColor.green(versioningConfigFilePath)}...`));
}
const coreVersions: SidetreeVersionModel[] = require(versioningConfigFilePath);

const ipfsFetchTimeoutInSeconds = 10;
const cas = new Ipfs(config.ipfsHttpApiEndpointUri, ipfsFetchTimeoutInSeconds);
const sidetreeCore = new SidetreeCore(config, coreVersions, cas);

const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();
router.post('/operations', async (ctx, _next) => {
  const response = await sidetreeCore.handleOperationRequest(ctx.body);
  setKoaResponse(response, ctx.response);
});

router.get('/version', async (ctx, _next) => {
  const response = await sidetreeCore.handleGetVersionRequest();
  setKoaResponse(response, ctx.response);
});

const resolvePath = '/identifiers/';
router.get(`${resolvePath}:did`, async (ctx, _next) => {
  // Strip away the first '/identifiers/' string.
  const didOrDidDocument = ctx.url.split(resolvePath)[1];
  const response = await sidetreeCore.handleResolveRequest(didOrDidDocument);
  setKoaResponse(response, ctx.response);
});

router.get('/monitor/operation-queue-size', async (ctx, _next) => {
  const body = await sidetreeCore.monitor.getOperationQueueSize();
  const response = { status: ResponseStatus.Succeeded, body };
  setKoaResponse(response, ctx.response);
});

router.get('/monitor/writer-max-batch-size', async (ctx, _next) => {
  const body = await sidetreeCore.monitor.getWriterMaxBatchSize();
  const response = { status: ResponseStatus.Succeeded, body };
  setKoaResponse(response, ctx.response);
});

app.use(router.routes())
  .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

(async () => {
  try {
    await sidetreeCore.initialize();

    const port = config.port;
    app.listen(port, () => {
      console.log(`ION node running on port: ${port}`);
    });
  } catch (error) {
    const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
    console.log(`ION node initialization failed with error ${serializedError}`);
    process.exit(1);
  }
})();

/**
 * Sets the koa response according to the Sidetree response object given.
 */
const setKoaResponse = (response: SidetreeResponseModel, koaResponse: Koa.Response) => {
  koaResponse.status = SidetreeResponse.toHttpStatus(response.status);

  if (response.body) {
    koaResponse.set('Content-Type', 'application/json');
    koaResponse.body = response.body;
  } else {
    // Need to set the body explicitly to empty string, else koa will echo the request as the response.
    koaResponse.body = '';
  }
};
