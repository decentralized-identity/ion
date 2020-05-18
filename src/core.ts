import * as getRawBody from 'raw-body';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import LogColor from '../bin/LogColor';
import {
  SidetreeConfig,
  SidetreeCore,
  SidetreeResponse,
  SidetreeResponseModel
} from '@decentralized-identity/sidetree';
import { ProtocolVersionModel } from '@decentralized-identity/sidetree/dist/lib/core/VersionManager';

/** Configuration used by this server. */
interface ServerConfig extends SidetreeConfig {
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

// Selecting protocol versioning file, environment variable overrides default config file.
let protocolVersioningConfigFilePath = '../json/testnet-core-protocol-versioning.json';
if (process.env.ION_CORE_PROTOCOL_VERSIONING_CONFIG_FILE_PATH === undefined) {
  console.log(LogColor.yellow(`Environment variable ION_CORE_PROTOCOL_VERSIONING_CONFIG_FILE_PATH undefined, using default protocol versioning config path ${protocolVersioningConfigFilePath} instead.`));
} else {
  protocolVersioningConfigFilePath = process.env.ION_CORE_PROTOCOL_VERSIONING_CONFIG_FILE_PATH;
  console.log(LogColor.lightBlue(`Loading protocol versioning config from ${LogColor.green(protocolVersioningConfigFilePath)}...`));
}
const protocolVersions: ProtocolVersionModel[] = require(protocolVersioningConfigFilePath);

const sidetreeCore = new SidetreeCore(config, protocolVersions);
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

router.get('/identifiers/:did', async (ctx, _next) => {
  // Strip away the first '/identifiers/' string.
  const didOrDidDocument = ctx.url.split('/identifiers/')[1];
  const response = await sidetreeCore.handleResolveRequest(didOrDidDocument);
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
