#!/bin/bash

# Get data directory for bitcoin data
echo -n "Please enter the directory for storing the bitcoin blockchain data: "
read bitcoinDataDirectory
if [[ ! -d $bitcoinDataDirectory ]]; then
  echo "$bitcoinDataDirectory is not a directory, creating"
  mkdir $bitcoinDataDirectory
  exit 1
fi

if [[ ! -w $bitcoinDataDirectory ]]; then
  echo "Cannot write in $bitcoinDataDirectory";
  exit 1
fi

# Get data directory for mongo db
echo -n "Please enter the directory for storing data for the core service: "
read coreDataDirectory
if [[ ! -d $coreDataDirectory ]]; then
  echo "$coreDataDirectory is not a directory"
  mkdir $coreDataDirectory
  exit 1
fi

if [[ ! -w $coreDataDirectory ]]; then
  echo "Cannot write in $coreDataDirectory";
  exit 1
fi

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
rpcuser=admin
rpcpassword=$password
rpcport=18332
rpcallowip=0.0.0.0/0
rpcconnect=127.0.0.1
rpcbind=0.0.0.0
" > $bitcoinDataDirectory/bitcoin.conf

echo "Starting up bitcoin-node service"

# start the docker bitcoin node
DATA_VOL=$bitcoinDataDirectory docker-compose up -d bitcoin-node
sleep 3
echo -ne "Bitcoin-node started, please wait for this to complete a sync before proceeding \n
Run \"docker logs -f bitcoin-node\" to tail the current logs from the node \n
When the logs show an entry like \"2020-07-08T03:39:41Z UpdateTip: new best=00000000324c4621bdba9b3c8f034dbe1086f643dbf1eb4f609174c8e384acca height=1534 version=0x00000001 log2_work=42.584045 tx=2476 date='2012-05-25T17:17:13Z' progress=1.000000 cache=0.3MiB(1771txo)\" ending with \"progress=1.00000\" the sync is complete \n
Press enter to continue \n"
read

DATA_VOL=$bitcoinDataDirectory DB_VOL=$coreDataDirectory docker-compose up -d