#!/bin/bash
echo "SETTING UP MAINNET CONFIGURATION FOR ION"
# Get data directory for bitcoin data
echo -n "Please enter the directory for storing the bitcoin blockchain data: "
read bitcoinDataDirectory
if [[ ! -d $bitcoinDataDirectory ]]; then
  echo "$bitcoinDataDirectory is not a directory, creating"
  mkdir $bitcoinDataDirectory
fi

if [[ ! -w $bitcoinDataDirectory ]]; then
  echo "Cannot write in $bitcoinDataDirectory";
fi

# Get data directory for mongo db
echo -n "Please enter the directory for storing data for the mongo service: "
read coreDataDirectory
if [[ ! -d $coreDataDirectory ]]; then
  echo "$coreDataDirectory is not a directory"
  mkdir $coreDataDirectory
fi

if [[ ! -w $coreDataDirectory ]]; then
  echo "Cannot write in $coreDataDirectory";
  exit 1
fi

# Get data directory for mongo db
echo -n "Please enter the directory for storing data for the IPFS service: "
read ipfsDataDirectory
if [[ ! -d $ipfsDataDirectory ]]; then
  echo "$ipfsDataDirectory is not a directory"
  mkdir $ipfsDataDirectory
fi

if [[ ! -w $ipfsDataDirectory ]]; then
  echo "Cannot write in $ipfsDataDirectory";
  exit 1
fi

echo "creating containers without starting."
#create all containers, don't start them yet since they need to be started in order and will fail to start if the other service isn't running yet.
DATA_VOL=$bitcoinDataDirectory DB_VOL=$coreDataDirectory IPFS_VOL=$ipfsDataDirectory docker-compose up --no-start

#start IPFS and Mongo. This gives IPFS time to start finding peers
docker start mongo
docker start IPFS
#start bitcoin main, this can take 24 hours to complete, the script will wait for it to finish
#start ion-bitcoin, this can take 12 hours
#lastly start ion-core to start the service

echo "creating config files"
# generate RPC password
if [[ -e /dev/urandom ]]; then
  password=$(head -c 32 /dev/urandom | base64 -)
else
  password=$(head -c 32 /dev/random | base64 -)
fi

echo "
server=1
txindex=1
[main]
rpcuser=admin
rpcpassword=$password
rpcport=8332
rpcallowip=0.0.0.0/0
rpcconnect=127.0.0.1
rpcbind=0.0.0.0
" > $bitcoinDataDirectory/bitcoin.conf


# patch the configuration for ION
echo "
{
  \"bitcoinDataDirectory\": \"/bitcoindata\",
  \"bitcoinFeeSpendingCutoffPeriodInBlocks\": 1,
  \"bitcoinFeeSpendingCutoff\": 0.001,
  \"bitcoinPeerUri\": \"http://bitcoin-core-mainnet:8332\",
  \"bitcoinRpcUsername\": \"admin\",
  \"bitcoinRpcPassword\": \"$password\",
  \"bitcoinWalletOrImportString\": \"5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF\",
  \"databaseName\": \"ion-mainnet-bitcoin\",
  \"genesisBlockNumber\": 633700,
  \"mongoDbConnectionString\": \"mongodb://mongo:27017/\",
  \"port\": 3002,
  \"sidetreeTransactionFeeMarkupPercentage\": 1,
  \"sidetreeTransactionPrefix\": \"ion:\",
  \"valueTimeLockAmountInBitcoins\": 0
}" > ../json/mainnet-bitcoin-docker-config.json

echo "Starting up bitcoin-node service"

# start the docker bitcoin node
docker start bitcoin-core-mainnet
sleep 3
echo -ne "Bitcoin-core-mainnet started, please wait for this to complete a sync before proceeding
Run \"docker logs -f bitcoin-core-mainnet\" to tail the current logs from the node in another session to track progress
When the logs show an entry like \"2020-07-08T03:39:41Z UpdateTip: new best=00000000324c4621bdba9b3c8f034dbe1086f643dbf1eb4f609174c8e384acca height=1534 version=0x00000001 log2_work=42.584045 tx=2476 date='2012-05-25T17:17:13Z' progress=1.000000 cache=0.3MiB(1771txo)\" ending with \"progress=1.00000\" the sync is complete

Please be patient. It takes a minute before the syncing starts and after that it can take up to 24 hours to download the entire database.
\n\n"

# wait for download
while [ true ];
do
  PROGRESS=`sudo tail -n 1 $bitcoinDataDirectory/debug.log | grep -Po 'progress=\K.*?(.{5})\s'`
  echo -ne "$PROGRESS (syncing)"\\r

  if [[ ${PROGRESS:0:1} -eq 1 ]]; then
    echo -ne "done"\\r
    break;
  fi

  sleep 1
done

echo -ne "Starting ion-bitcoin, please wait the service finish scanning the bitcoin blockfiles before proceeding \n
Run \" docker logs -f ion-bitcoin\" to tail the current logs from the node \n
When the log shows an entry like \" bla bla \" the sync is complete \n"
docker start ion-bitcoin-mainnet
#TODO, write piece of bash which monitors the log files and continues automatically when it's done scanning the blk files
read

echo -ne "Starting ion-node\n"
docker start ion-core-mainnet

echo -ne "Congratulations. Your ION node is running connected to bitcoin mainnet. Happy resolving"
read

