# ION using Docker 

This directory contains the automated Docker deployment of ION.  This will create 5 docker containers that contain the core components to run ION.

- bitcoin-core - This container will run the bitcoin-core client.  `NOTE: This is currently using testnet as the source chain`

- ion-bitcoin - This is the bitcoin sidetree node for ION.

- ion-ipfs - This is the local IPFS node used by the sidetree.

- mongo - This is the local MongoDB used by the sidetree.

- ion-core - This is the core sidetree node.

The automation will create the docker containers in order (and will wait for bitcoin sync).

## Prerequisites

This implementation is designed to be run with very little dependencies, on a Linux host.

- Linux Ubuntu 18.04LTS  `NOTE: You will need about 31 GB of free space for bitcoin testnet.`

- Docker engine (latest)
  ```
  sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

  curl -fsSL --max-time 10 --retry 3 --retry-delay 3 --retry-max-time 60 https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

  sudo apt-get update
  sudo apt-get install -y docker-ce
  sudo systemctl enable docker
  ```

- Docker compose (latest)
  ```
  sudo curl -L --max-time 10 --retry 3 --retry-delay 3 --retry-max-time 60 "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

  sudo chmod +x /usr/local/bin/docker-compose
  ```

- NodeJS - version 10.x   `NOTE: This has a requirement for version 10 of nodejs only`
  ```
  curl -sl https://deb.nodesource.com/setup_10.x | sudo bash -
  ```

- make - Build tool used for library this depends on.  `NOTE: You can get this as part of the build-essential package for debian based os`
  ```
  apt-get install build-essential -y
  ```

## Run

To use this setup, complete the prerequisites.  Next simply run the [configuration script](config.sh).  The script will prompt for a data directory to use.  As noted above, you will need about 31GB of free space to run this.

```
./config.sh
```

The setup will take around 1 hour, based on your machine and internet connectivity speed.  This is primarily because the bitcoin testnet full node will be required to be synced before starting ION.  A simple progress indicator will be shown to give status on the sync operation.

`NOTE: This configuration is using a test key for bitcoin.  You can find this in the config.sh file with the parameter, _bitcoinWalletOrImportString_.  This should be changed to a real key that is appropriately secured for production workloads!`