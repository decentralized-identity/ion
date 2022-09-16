import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as getRawBody from 'raw-body';
import * as querystring from 'querystring';
import {
  ISidetreeBitcoinConfig,
  SidetreeBitcoinProcessor,
  SidetreeBitcoinVersionModel
} from '@decentralized-identity/sidetree';
import LogColor from '../bin/LogColor';

/** Bitcoin service configuration parameters */
interface IBitcoinServiceConfig extends ISidetreeBitcoinConfig {
  /** Boolean to control if error thrown by request handler is logged. */
  logRequestError?: boolean;
  /** Port number used by the service. */
  port: number;
}

/**
 * Handles the request using the given request handler then assigns the returned value as the body.
 * NOTE: The value of this method is really the unified handling of errors thrown.
 * @param requestHandler Request handler.
 * @param koaResponse Response object to update.
 */
async function handleRequestAndSetKoaResponse (requestHandler: () => Promise<any>, koaResponse: Koa.Response) {
  try {
    const responseBody = await requestHandler();
    koaResponse.status = 200;
    koaResponse.set('Content-Type', 'application/json');

    if (responseBody) {
      koaResponse.body = JSON.stringify(responseBody);
    } else {
      // Need to set the body explicitly, otherwise Koa will return HTTP 204
      koaResponse.body = '';
    }
  } catch (error) {
    if ('status' in error) {
      koaResponse.status = error.status;
    } else {
      // This is an unknown/unexpected error.
      koaResponse.status = 500;

      // Log error if the config flag is switched on.
      if (config.logRequestError) {
        console.error(error);
      }
    }

    if ('code' in error) {
      koaResponse.body = JSON.stringify({
        code: error.code
      });
    }
  }
}

// Selecting configuration file, environment variable overrides default config file.
let configFilePath = '../json/testnet-bitcoin-config.json';
if (process.env.ION_BITCOIN_CONFIG_FILE_PATH === undefined) {
  console.log(LogColor.yellow(`Environment variable ION_BITCOIN_CONFIG_FILE_PATH undefined, using default path ${configFilePath} instead.`));
} else {
  configFilePath = process.env.ION_BITCOIN_CONFIG_FILE_PATH;
  console.log(LogColor.lightBlue(`Loading configuration from ${LogColor.green(configFilePath)}...`));
}
const config: IBitcoinServiceConfig = require(configFilePath);

// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../json/testnet-bitcoin-versioning.json';
if (process.env.ION_BITCOIN_VERSIONING_CONFIG_FILE_PATH === undefined) {
  console.log(LogColor.yellow(
    `Environment variable ION_BITCOIN_VERSIONING_CONFIG_FILE_PATH undefined, using default ION bitcoin versioning config path ${versioningConfigFilePath}.`
  ));
} else {
  versioningConfigFilePath = process.env.ION_BITCOIN_VERSIONING_CONFIG_FILE_PATH;
  console.log(LogColor.lightBlue(`Loading ION bitcoin versioning config from ${LogColor.green(versioningConfigFilePath)}...`));
}
const ionBitcoinVersions: SidetreeBitcoinVersionModel[] = require(versioningConfigFilePath);

const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();

router.get('/transactions', async (ctx, _next) => {
  const params = querystring.parse(ctx.querystring);

  let requestHandler;
  if ('since' in params && 'transaction-time-hash' in params) {
    const since = Number(params['since']);
    const transactionTimeHash = String(params['transaction-time-hash']);
    requestHandler = () => blockchainService.transactions(since, transactionTimeHash);
  } else {
    requestHandler = () => blockchainService.transactions();
  }

  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/version', async (ctx, _next) => {
  const requestHandler = () => blockchainService.getServiceVersion();
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/fee/:blockchainTime', async (ctx, _next) => {
  const requestHandler = () => blockchainService.getNormalizedFee(ctx.params.blockchainTime);
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.post('/transactions', async (ctx, _next) => {
  const writeRequest = JSON.parse(ctx.body);
  const requestHandler = () => blockchainService.writeTransaction(writeRequest.anchorString, writeRequest.minimumFee);
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.post('/transactions/firstValid', async (ctx, _next) => {
  const transactionsObject = JSON.parse(ctx.body);
  const requestHandler = () => blockchainService.firstValidTransaction(transactionsObject.transactions);
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/time', async (ctx, _next) => {
  const requestHandler = () => blockchainService.time();
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/time/:hash', async (ctx, _next) => {
  const requestHandler = () => blockchainService.time(ctx.params.hash);
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/locks/:identifier', async (ctx, _next) => {
  const requestHandler = () => blockchainService.getValueTimeLock(ctx.params.identifier);
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/writerlock', async (ctx, _next) => {
  const requestHandler = () => blockchainService.getActiveValueTimeLockForThisNode();
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.get('/monitors/balance', async (ctx, _next) => {
  const requestHandler = () => blockchainService.monitor.getWalletBalance();
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

app.use(router.routes())
  .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

const port = process.env.SIDETREE_BITCOIN_PORT || config.port;

// initialize the blockchain service and kick-off background tasks
let server: any;
let blockchainService: SidetreeBitcoinProcessor;
try {
  blockchainService = new SidetreeBitcoinProcessor(config);

  // SIDETREE_TEST_MODE enables unit testing of this file by bypassing blockchain service initialization.
  if (process.env.SIDETREE_TEST_MODE === 'true') {
    server = app.listen(port);
  } else {
    blockchainService.initialize(ionBitcoinVersions)
      .then(() => {
        server = app.listen(port, () => {
          console.log(`Sidetree-Bitcoin node running on port: ${port}`);
        });
      })
      .catch((error) => {
        console.error(`Sidetree-Bitcoin node initialization failed with error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
        process.exit(1);
      });
  }
} catch (error) {
  console.log(error.toString());
  console.log('Is bitcoinWalletImportString valid? Consider using testnet key generated below:');
  console.log(SidetreeBitcoinProcessor.generatePrivateKeyForTestnet());
  process.exit(1);
}
console.info('Sidetree bitcoin service configuration:');
// console.info(config);

export {
  server,
  blockchainService
};
