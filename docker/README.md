# ION using Docker 

This directory contains the automated Docker deployment of ION.  This will create 5 docker containers that contain the core components to run ION.

- bitcoin-core-mainnet - This container will run the bitcoin-core client.  `NOTE: This is config is running on mainnet as the source chain`
- ion-bitcoin-mainnet - This is the bitcoin sidetree node for ION.
- ipfs - This is the local IPFS node used by the sidetree.
- mongo - This is the local MongoDB used by the sidetree.
- ion-core-mainnet - This is the core sidetree node.

The automation will create the docker containers in order (and will wait for bitcoin sync).
After ion-bitcoin is done synchronizing the blocks you need to hit enter to start the ion-core container. It cannot start if ion-bitcoin is still scanning files.

## Prerequisites

This implementation is designed to be run with very little dependencies, on a Linux host.

- Linux Ubuntu 18.04LTS  `NOTE: You will need about 350 GB of free space for bitcoin mainnet.`

- Docker engine (latest) (from https://docs.docker.com/engine/install/ubuntu/)
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

- NodeJS - version 14.x   `NOTE: This has a requirement for version 14 of nodejs only`
  ```
  curl -sl https://deb.nodesource.com/setup_14.x | sudo bash -
  ```

- make - Build tool used for library this depends on.  `NOTE: You can get this as part of the build-essential package for debian based os`
  ```
  apt-get install build-essential -y
  ```

## Run
Before you start the setup you need to install the packages from the directory with the ION repo.
```
npm install
npm run build
```
After those ran succesfully, navigate to the docker directory and run the configuration script [configuration script](deploy-docker-mainnet.sh). The script will prompt for data directories to use. As noted above, you will need about 350GB of free space to run this.

```
./deploy-docker-mainnet.sh
```

The setup will take around 24-30 hours, based on your machine and internet connectivity speed.  This is primarily because the bitcoin mainnet full node will be required to be synced before starting ION.  A simple progress indicator will be shown to give status on the sync operation. The sync of mainnet can take around 24 hours.

`NOTE: This configuration is using a test key for bitcoin.  You can find this in the json file mainnet-bitcoin-docker-config.json file with the parameter, bitcoinWalletOrImportString.  This should be changed to a real key that is appropriately secured for production workloads if you want to be able to write to the network. If you want to only resolve did's the keys works fine!`
