# ION Installation Guide

ION is a decentralized Layer 2 network for Decentralized Identifiers that runs atop the Bitcoin blockchain. Running an ION node minimizes trust in external parties for resolving ION DIDs, helps make the network more resilient and reliable, and provides the operator with better DID resolution performance.

The ION node reference implementation is currently in a volatile alpha phase, running on Bitcoin's test net. Operators should expect frequent breaking changes and regular resets of the network's state. Presently, we are only recommending that experienced developers invest the time in running, testing, and contributing to the code base. This recommendation will change as the implementation progresses into more stable stages of development, which contributors will communicate to the community via blog posts and communications from DIF and collaborating organizations.

The ION node implementation is composed of a collection of microservices written in TypeScript. Of these components, the major dependencies are Bitcoin/bitcore, IPFS, and MongoDB (for local persistence of data).

## 1. Preparing your development environment

### Hardware

We recommend you run ION on a machine with the following minimum specs:

- i5 processor (2017+ models)
- 6GB of RAM
- 1TB of storage

### Operating System

Both Linux and Windows are supported and tested. For Linux, the setup is verified on Ubuntu 18, so we recommend Debian-based distros for Linux setup.

#### Linux Environment Setup

##### Snap

We use snap to simplify installation of certain services. Run the following command to install snap:
```
sudo apt install snapd
```

##### Node.js

Services within ION rely on Node.js version 10. Run the following command to install Node v10:
```
sudo snap install node --classic --channel=10
```

#### Windows Environment Setup

Go go https://nodejs.org, download and install the latest v10 of Node.js.

### Inbound Ports to Open

If you wish to run a node that writes DID operations to the Bitcoin blockchain, you will need to open ports `4002` and `4003` so that the transaction files (Anchor and Batch files) can be served to others via IPFS.

## 2. Setting up Bitcoin Core

An ION node needs a trusted Bitcoin peer for fetching and writing ION transactions. We use Bitcoin Core for this.

### Automated script for installing Bitcoin Core

If you would like to install and start Bitcoin Core automatically on Linux, you can review and run the automated script commited in the [Sidetree repo](https://github.com/decentralized-identity/sidetree/blob/master/lib/bitcoin/setup.sh).

> NOTE: Initial synchronization takes ~6 hours on testnet.

### Installing Bitcoin Core Manually

You can find Windows and Linux binaries for Bitcoin Core releases [here.](https://bitcoincore.org/en/releases/)

#### On Linux:

Create a configuration file (`bitcoin.conf`) designating the path you would like the Bitcoin data to be stored in (`[datadir]`):
```yaml
testnet=1
server=1
datadir=~/.bitcoin
rpcuser=<your-rpc-username>
rpcpassword=<your-rpc-password>
```

Start Bitcoin Core and let it sync with Testnet:

```
./bin/bitcoind --config bitcoin.conf
```
> You can add `--daemon` to run bitcoind as a daemon process.

#### On Windows:

```
bitcoin-qt.exe -testnet -datadir=<path-to-store-data> -server -rpcuser=<you-rpc-username> -rpcpassword=<your-rpc-password>
```
    
## 3. Setting up MongoDB

### On Linux:

The default persistence option for storing data locally is MongoDB, though it is possible to create adapters for other datastores. To use the default MongoDB option, you'll need to install MongoDB community build:

- Download as a `deb` package: https://www.mongodb.com/download-center/community.
- Installation doc: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

> NOTE: You may not have all the dependencies required to run MongoDB, if so you can run `sudo apt-get install -f` to bring them in.

You'll probably want to store the data from the Mongo instance in the same drive you chose to store the blockchain data, due to the large amount of storage required. Set the directory for this by creating a `db` folder in the location you chose and run `mongod --dbpath ~/YOUR_LOCATION/db`

### On Windows:

Download and install MongoDB from https://www.mongodb.com/download-center/community.

> NOTE: To view MongoDB files with a more approachable GUI, download and install MongoDB Compass: https://docs.mongodb.com/compass/master/install/

## 4. Configure & Build ION Microservices

Clone https://github.com/decentralized-identity/ion:
```
git clone https://github.com/decentralized-identity/ion
```

Update the configuration for the Sidetree Bitcoin microservice under `json/bitcoin-config.json`:

  - Ensure `bitcoinPeerUri` points to the http location of the Bitcoin Core client you setup earlier in this guide (e.g. `http://localhost:18332`).
  - Ensure `bitcoinWalletImportString` is populated with your private key.
  - Official Bitcoin Core client PRC API requires authentication, so make sure the `bitcoinRpcUsername` & `bitcoinPrcPassword` are populated accordingly.
  - Ensure `mongoDbConnectionString` is pointing to your MongoDB (e.g. `mongodb://localhost:27017/`).
  
Update the configuration for the Sidetree core service under `json/core-config.json`:

  - Ensure `mongoDbConnectionString` is pointing to your MongoDB (e.g. `mongodb://localhost:27017/`).

Run the following commands to build ION:
```
npm i
npm run build
```

> NOTE: You must rerun `npm run build` everytime a configuration JSON file is modified.

## 5. Run Sidetree Bitcoin microservice
```
npm run bitcoin
```
This service will fail to start until your Bitcoin Core client has blocks past the ION genesis block. Please wait and try again later if this happens.

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

Verify ION is running properly by checking the following DID resolution link in your browser: [http://localhost:3000/did:ion:test:EiDk2RpPVuC4wNANUTn_4YXJczjzi10zLG1XE4AjkcGOLA](http://localhost:3000/did:ion:test:EiDk2RpPVuC4wNANUTn_4YXJczjzi10zLG1XE4AjkcGOLA)
