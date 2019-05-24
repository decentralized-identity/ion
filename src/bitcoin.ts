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

const config: IBitcoinServiceConifg = require('../json/bitcoin-config.json');
const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();

router.get('/transactions', async (ctx, _next) => {

  const params = querystring.parse(ctx.querystring);
  if ('since' in params && 'transaction-time-hash' in params) {
    const since = Number(params['since']);
    const transactionTimeHash = String(params['transaction-time-hash']);
    const response = await blockchainService.transactions(since, transactionTimeHash);
    setKoaResponse(response, ctx.response);
  } else {
    const response = await blockchainService.transactions();
    setKoaResponse(response, ctx.response);
  }
});

router.post('/transactions', async (ctx, _next) => {
  const writeRequest = JSON.parse(ctx.body);
  const response = await blockchainService.writeTransaction(writeRequest.anchorFileHash);
  setKoaResponse(response, ctx.response);
});

router.post('/transactions/firstValid', async (ctx, _next) => {
  const transactionsObject = JSON.parse(ctx.body);
  const response = await blockchainService.firstValidTransaction(transactionsObject.transactions);
  setKoaResponse(response, ctx.response);
});

router.get('/time', async (ctx, _next) => {
  const response = await blockchainService.time();
  setKoaResponse(response, ctx.response);
});

router.get('/time/:hash', async (ctx, _next) => {
  const response = await blockchainService.time(ctx.params.hash);
  setKoaResponse(response, ctx.response);
});

app.use(router.routes())
  .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

const port = process.env.SIDETREE_BITCOIN_PORT || config.port;

// initialize the blockchain service and kick-off background tasks
let blockchainService: SidetreeBitcoinProcessor;
try {
  blockchainService = new SidetreeBitcoinProcessor(config);

  blockchainService.initialize()
    .then(() => {
      app.listen(port, () => {
        console.log(`Sidetree-Bitcoin node running on port: ${port}`);
      });
    })
    .catch((error: Error) => {
      console.error(`Sidetree-Bitcoin node initialization failed with error: ${error}`);
      process.exit(1);
    });
} catch (error) {
  console.log('Is bitcoinWalletImportString valid? Consider using testnet key...');
  console.log(SidetreeBitcoinProcessor.generatePrivateKey('testnet'));
  process.exit(1);
}
console.info('Sidetree bitcoin service configuration:');
console.info(config);

/**
 * Sets the koa response according to the Sidetree response object given.
 * @param response Response object fetched from request handler.
 * @param koaResponse Koa Response object to be filled
 * @param contentType Content type to be set for response, defaults to application/json
 */
const setKoaResponse = (response: any, koaResponse: Koa.Response, contentType?: string) => {
  koaResponse.status = 200;
  if (contentType) {
    koaResponse.set('Content-Type', contentType);
  } else {
    koaResponse.set('Content-Type', 'application/json');
  }
  koaResponse.body = response ? JSON.stringify(response) : '';
};
