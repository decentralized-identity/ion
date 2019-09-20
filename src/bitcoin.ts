import * as getRawBody from 'raw-body';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as querystring from 'querystring';
import {
  ISidetreeBitcoinConfig,
  SidetreeBitcoinProcessor
} from '@decentralized-identity/sidetree';

/** Bitcoin service configuration parameters */
interface IBitcoinServiceConifg extends ISidetreeBitcoinConfig {
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
    console.error(error);
    if ('status' in error) {
      koaResponse.status = error.status;
    }

    if ('code' in error) {
      koaResponse.body = JSON.stringify({
        code: error.code
      });
    }
  }
}

const configFilePath = process.env.SIDETREE_BITCOIN_CONFIG_FILE_PATH || '../json/bitcoin-config.json';
const config: IBitcoinServiceConifg = require(configFilePath);
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
  let requestHandler = () => blockchainService.getServiceVersion();
  await handleRequestAndSetKoaResponse(requestHandler, ctx.response);
});

router.post('/transactions', async (ctx, _next) => {
  const writeRequest = JSON.parse(ctx.body);
  const requestHandler = () => blockchainService.writeTransaction(writeRequest.anchorFileHash);
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
    blockchainService.initialize()
    .then(() => {
      server = app.listen(port, () => {
        console.log(`Sidetree-Bitcoin node running on port: ${port}`);
      });
    })
    .catch((error) => {
      console.error(`Sidetree-Bitcoin node initialization failed with error: ${error}`);
      process.exit(1);
    });
  }
} catch (error) {
  console.log('Is bitcoinWalletImportString valid? Consider using testnet key generated below:');
  console.log(SidetreeBitcoinProcessor.generatePrivateKey('testnet'));
  process.exit(1);
}
console.info('Sidetree bitcoin service configuration:');
console.info(config);

export {
  server,
  blockchainService
};
