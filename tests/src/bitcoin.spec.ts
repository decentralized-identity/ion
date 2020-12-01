// MUST set these environment variables before `blockchainService` and `server` are imported.
process.env.SIDETREE_TEST_MODE = 'true';
process.env.SIDETREE_BITCOIN_CONFIG_FILE_PATH = '../tests/json/bitcoin-config-test.json';

import * as supertest from 'supertest';
import ErrorCode from '@decentralized-identity/sidetree/dist/lib/common/SharedErrorCode';
import RequestError from '@decentralized-identity/sidetree/dist/lib/bitcoin/RequestError';
import ResponseStatus from '@decentralized-identity/sidetree/dist/lib/common/enums/ResponseStatus';
import { blockchainService, server } from '../../src/bitcoin';

describe('Bitcoin service', async () => {
  it('should return 400 with error code when transaction fetch throws invalid hash error.', async () => {
    const fakeGetTransactionsMethod = async () => { throw new RequestError(ResponseStatus.BadRequest, ErrorCode.InvalidTransactionNumberOrTimeHash); };
    spyOn(blockchainService, 'transactions').and.callFake(fakeGetTransactionsMethod);

    const response = await supertest(server).get('/transactions?since=6212927891701761&transaction-time-hash=dummyHash');

    expect(response.status).toEqual(400);

    const actualResponseBody = JSON.parse(response.body.toString());
    expect(actualResponseBody).toBeDefined();
    expect(actualResponseBody.code).toEqual(ErrorCode.InvalidTransactionNumberOrTimeHash);
  });
});
