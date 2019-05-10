# ION Installation Guide

ION is a decentralized Layer 2 network for Decentralized Identifiers that runs atop the Bitcoin blockchain. Running an ION node minimizes trust in external parties for resolving ION DIDs, helps make the network more resilient and reliable, and provides the operator with better DID resolution performance.

The ION node reference implementation is currently in a volatile alpha phase, running on Bitcoin's test net. Operators should expect frequent breaking changes and regular resets of the network's state. Presently, we are only recommending that experienced developers invest the time in running, testing, and contributing to the code base. This recommendation will change as the implementation progresses into more stable stages of development, which contributors will communicate to the community via blog posts and communications from DIF and collaborating organizations.

The ION node implementation is composed of a collection of microservices written in TypeScript. Of these components, the major dependencies are Bitcoin/bitcore, IPFS, and MongoDB (for local persistence of data).

## 1. Preparing your development environment

#### Hardware

We recommend you run ION on a machine with the following minimum specs:

- i5 processor (2017+ models)
- 6GB of RAM
- 1TB of storage

#### Operating System

Setup a Debian-based distros of Linux. This guide was verified on Ubuntu 18, so we currently recommend this distro and version. 

#### Node.js and NVM

Services within ION rely on both Node.js version 9 and 10. To install both versions and easily use them together, you'll need to install the Node Version Manager (NVM) utility. Installation of NVM should be as easy as running the following command and restarting your console:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

> NOTE: If the command above doesn't work for some reason, there are other installation options detailed in the [NVM installation doc](https://github.com/creationix/nvm#installation-and-update).

Once NVM is installed, run the following command to install Node v9 and v10.15.3:
    
    nvm install 9
    nvm install 10.15.3

#### Ports for ION node writes to Bitcoin

If you wish to run a node that writes DID operations to the Bitcoin blockchain, you will need to open ports `4002` and `4003`.

## 2. Setting up the Sidetree blockchain service

### Prerequisites

    sudo add-apt-repository ppa:chris-lea/zeromq
    sudo apt-get update
    sudo apt-get install python
    sudo apt-get install -y libzmq3-dev
    sudo apt-get install build-essential

### Install Bitcore

Run `nvm use 9` to ensure you're using the version that the current version of Bitcore requires.

Install the Bitcore npm package:

    npm install -g bitcore

Run the following initialization command in your desired directory/drive location - which this guide will refer to as `ion-bitcore` - where you want the Bitcoin `testnet` data to be stored:

    bitcore create ion-bitcore --testnet
    
Clone the Sidetree Bitcoin repo:

    git clone https://github.com/decentralized-identity/sidetree-bitcoin

Navigate to the `sidetree-bitcoin/bitcored-services/sidetree` directory of the cloned repo and run the following:
    
    npm install bitcore-lib
    
Navigate to the directory of the `ion-bitcore` instance you created, and run the following:

    bitcore install insight-api insight-ui

    cd /node_modules
    
    ln -s sidetree-bitcoin/src/bitcored-services/sidetree ion-bitcore
    
Add the string `ion-bitcore` to the services array in the `ion-bitcore` instance's `bitcore-node.json` configuration file.
    

To start the bitcored daemon by navigating to the root of the `ion-bitcore` instance you created, and run the following:

    bitcored

> NOTE: Bitcore can, in some circumstances, fail with RPC queue errors, so you may also want to manually increase the RPC worker queue limit. You can do this by adding `rpcworkqueue=64` to the `bitcoin.conf` file located in your `ion-bitcore` instance directory.
   

Verify that the bitcored installation was successful by pointing the browser to:

    http://localhost:3001/insight/
    
Once Sidetree's bitcored instance is running correctly, you'll need to build and run the Sidetree’s Bitcoin service that consumes the blockchain data and APIs exposed by bitcored:

Clone the Sidetree Bitcoin repo and navigate to its root directory: https://github.com/decentralized-identity/sidetree-bitcoin

Examine the `json/config.json` file to ensure the `bitcoreSidetreeServiceUri` property points to the location of the bitcored service you setup earlier in this guide (e.g. `http://localhost:3001/SidetreeBlockchainService`)

Run the following commands:

    nvm use 10.15.3
    npm i
    npm run build
    npm start
    
    
## 3. Setting up the IPFS service.

Clone the IPFS service repo and navigate to its root folder: https://github.com/decentralized-identity/sidetree-ipfs

After cloning the repo:

- cd into the the repo
- Run `git checkout ec6e63100`
- Change the `port` value in the `json/config.json` to `3002`

Run the following commands:

    nvm use 10.15.3
    npm i
    npm run build
    npm start

## 4. Setting up the ION service

### Installing MongoDB

The default persistence option for storing data locally is MongoDB, though it is possible to create adapters for other datastores. To use the default MongoDB option, you'll need to install MongoDB community build:

- Download as a `deb` package: https://www.mongodb.com/download-center/community.
- Installation doc: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

> NOTE: You may not have all the dependencies required to run MongoDB, if so you can run `sudo apt-get install -f` to bring them in.

You'll probably want to store the data from the Mongo instance in the same place you chose to store the blockchain data, due to the large amount of storage required. Set the directory for this by creating a `db` folder in the location you chose and `run mongod --dbpath ~/YOUR_LOCATION/db`

After MongoDB is installed and running, modify the `operationStoreUri` property of the JSON configuration file located at `/json/config.json` in the ION repo to match the location of your MongoDB instance.

To view MongoDB files with a more approachable GUI, download and install MongoDB Compass: https://docs.mongodb.com/compass/master/install/

### Configure & Build ION

Clone https://github.com/decentralized-identity/ion

Change the `contentAddressableStoreServiceUri` property in `json/config.json` to `http://127.0.0.1:3002/v1.0`

Run the following commands:

    nvm use 10.15.3
    npm i
    npm run build
    npm start


Verify ION is running properly by checking the following DID resolution link in your browser: http://localhost:3000/did:ion:EiBzpfCmJlxXnfJtJwBr-u6DLXAWX3g7CeLZXY_pFyNhvw
