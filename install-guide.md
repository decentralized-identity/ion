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

#### Node.js

Services within ION rely on Node.js version 10. Run the following command to install Node v10:
```
sudo snap install node --classic --channel=10
```

#### Inbound Ports to Open

If you wish to run a node that writes DID operations to the Bitcoin blockchain, you will need to open ports `4002` and `4003` so that the transaction files (Anchor and Batch files) can be served to others via IPFS.

## 2. Setting up Bcoin

An ION node needs a trusted Bitcoin peer for fetching and writing ION transactions, we use Bcoin for this.

### Automated script for installing Bcoin

If you would like to install and start Bcoin automatcially, you can review and run the automated script commited in the [Sidetree repo](https://github.com/decentralized-identity/sidetree/blob/master/lib/bitcoin/start.sh).

> NOTE: Initial synchronization takes ~6 hours on testnet.

### Installing Bcoin Manually

Node-gyp is required by Bcoin (the currently used bitcoin miner) and requires `make` and a c++ compiler. You can install these by:
```
sudo apt-get install gcc g++ make
```

Clone the Bcoin repo:
```
git clone git://github.com/bcoin-org/bcoin.git
```

Install the Bcoin dependencies:
```
cd bcoin
npm install
```

Create a Bcoin configuration file (`bcoin.conf`) designating the path you would like the Bitcoin data to be stored in (`[DATA DIRECTORY PATH]`):
```yaml
network: testnet
prefix: [DATA DIRECTORY PATH]
host: 127.0.0.1
port: 18332
http-port: 18331
workers-size: 1
index-address: true
```

Start Bcoin and let it sync with Testnet:
```
./bin/bcoin --config bcoin.conf
```
> You can add `--daemon` to run Bcoin as a daemon process.
    
## 3. Setting up MongoDB

The default persistence option for storing data locally is MongoDB, though it is possible to create adapters for other datastores. To use the default MongoDB option, you'll need to install MongoDB community build:

- Download as a `deb` package: https://www.mongodb.com/download-center/community.
- Installation doc: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

> NOTE: You may not have all the dependencies required to run MongoDB, if so you can run `sudo apt-get install -f` to bring them in.

You'll probably want to store the data from the Mongo instance in the same place you chose to store the blockchain data, due to the large amount of storage required. Set the directory for this by creating a `db` folder in the location you chose and `run mongod --dbpath ~/YOUR_LOCATION/db`

To view MongoDB files with a more approachable GUI, download and install MongoDB Compass: https://docs.mongodb.com/compass/master/install/

## 4. Configure & Build ION Microservices

Clone https://github.com/decentralized-identity/ion:
```
git clone https://github.com/decentralized-identity/ion
```

Update the configuration for the Sidetree Bitcoin microservice under `json/bitcoin-config.json`:

  - Ensure `bitcoinPeerUri` points to the http location of the bcoin service you setup earlier in this guide (e.g. `http://localhost:18331`).
  - Ensure `bitcoinWalletImportString` is populated with your private key.
  - Ensure `mongoDbConnectionString` is pointing to your MongoDB (e.g. `mongodb://localhost:27017/`).
  
Update the configuration for the Sidetree core service under `json/core-config.json`:

  - Ensure `mongoDbConnectionString` is pointing to your MongoDB (e.g. `mongodb://localhost:27017/`).

Run the following commands to build ION:
```
npm i
npm run build
```

> NOTE: You must run `npm run build` everytime a confiuration JSON file is modified.

## 5. Run Sidetree Bitcoin microservice
```
npm run bitcoin
```
This service will fail to start until your Bcoin node has blocks past the ION genesis block. Please wait and try again later if this happens.

## 6. Run Sidetree IPFS microservice

Start a new console and run the following commands:
```
npm run ipfs
```

## 7. Run Sidetree core service

Start a new console and run the following commands:
```
npm run core
```
Give it a few minutes to synchronize Sidetree transactions.

Verify ION is running properly by checking the following DID resolution link in your browser: http://localhost:3000/did:ion-test:EiBNsl-a8ZjvFsJCEousqy-9N4RFypLEU1Ha7pn9KPFpPg[http://localhost:3000/did:ion-test:EiBNsl-a8ZjvFsJCEousqy-9N4RFypLEU1Ha7pn9KPFpPg]
