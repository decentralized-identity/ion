#!/bin/bash

# Get data directory for bitcoin data
echo -n "Directory for blockchain data: "
read dataDirectory
if [[ ! -d $dataDirectory ]]; then
  echo "$dataDirectory is not a directory"
  exit 1
fi

if [[ ! -w $dataDirectory ]]; then
  echo "Cannot write in $dataDirectory";
  exit 1
fi

mkdir $dataDirectory/data $dataDirectory/db

# generate RPC password
if [[ -e /dev/urandom ]]; then
  password=$(head -c 32 /dev/urandom | base64 -)
else
  password=$(head -c 32 /dev/random | base64 -)
fi

echo "
testnet=1
server=1
txindex=1

[test]
datadir=/datadrive/data
rpcuser=admin
rpcpassword=$password
rpcport=18332
rpcallowip=0.0.0.0/0
rpcconnect=127.0.0.1
rpcbind=0.0.0.0
" > $dataDirectory/data/bitcoin.conf

# start the docker bitcoin node
DATA_VOL=/datadrive/data docker-compose up -d bitcoin-core
sleep 3
echo -ne "Please wait..."\\r

# wait for sync
while [ true ];
do
  PROGRESS=`sudo tail -n 1 /datadrive/testnet3/debug.log | grep -Po 'progress=\K.*?(.{5})\s'`
  echo -ne "$PROGRESS (syncing)"\\r

  if [[ ${PROGRESS:0:1} -eq 1 ]]; then
    echo -ne "done"\\r
    break;
  fi

  sleep 1
done

# start ion services
git clone https://github.com/decentralized-identity/ion.git
cd ion

# patch the configuration for ION
echo "
{
  \"bitcoinFeeSpendingCutoffPeriodInBlocks\": 1,
  \"bitcoinFeeSpendingCutoff\": 0.01,
  \"bitcoinPeerUri\": \"http://bitcoin-core:18332\",
  \"bitcoinRpcUsername\": \"admin\",
  \"bitcoinRpcPassword\": \"$password\",
  \"bitcoinWalletOrImportString\": \"cMibhWKqpn1DzkuiiKLsMzZorFgdh545mBR9FLhbyjX7f2kHxPiK\",
  \"sidetreeTransactionFeeMarkupPercentage\": 5,
  \"sidetreeTransactionPrefix\": \"ion:\",
  \"genesisBlockNumber\": 1723000,
  \"databaseName\": \"sidetree-bitcoin\",
  \"transactionFetchPageSize\": 100,
  \"mongoDbConnectionString\": \"mongodb://mongo:27017/\",
  \"port\": 3002,
  \"valueTimeLockAmountInBitcoins\": 0
}" > json/bitcoin-config.json

echo "
{
  \"batchingIntervalInSeconds\": 600,
  \"blockchainServiceUri\": \"http://bitcoin-ion:3002\",
  \"contentAddressableStoreServiceUri\": \"http://ipfs:3003\",
  \"didMethodName\": \"ion:test\",
  \"maxConcurrentDownloads\": 20,
  \"mongoDbConnectionString\": \"mongodb://mongo:27017/\",
  \"observingIntervalInSeconds\": 60,
  \"port\": 3000
}" > json/core-config.json

npm install
npm run build

cd ..

DATA_VOL=/datadrive/data DB_VOL=/datadrive/db docker-compose up -d
