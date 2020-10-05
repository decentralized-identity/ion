# ION Installation Guide

ION is a decentralized Layer 2 network for Decentralized Identifiers that runs atop the Bitcoin blockchain. Running an ION node minimizes trust in external parties for resolving ION DIDs, helps make the network more resilient and reliable, and provides the operator with better DID resolution performance.

The ION node reference implementation is currently in beta phase, operators should expect potential breaking changes and resets of the network's state. Presently, we are only recommending that experienced developers invest the time in running, testing, and contributing to the code base. This recommendation will change as the implementation progresses into more stable stages of development, which contributors will communicate to the community via blog posts and communications from DIF and collaborating organizations.

The ION node implementation is composed of a collection of microservices. Of these components, the major dependencies are Bitcoin Core, IPFS, and MongoDB (for local persistence of data).

> NOTE: This guide describes steps to setup an ION node targeting bitcoin testnet, but can be used to target the bitcoin mainnet by substituting testnet variables to mainnet.

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

You may need to add the snap binaries directory to your path by adding the following line in ~/.bash_profile
```
PATH="$PATH:/snap/bin"
```

To ensure that the path changes go into effect immediately:
```
source ~/.bash_profile
```

##### Node.js

Services within ION rely on Node.js version 12. Run the following command to install Node v12:
```
sudo snap install node --classic --channel=12
```

##### build-essential

Building ION requires your distro's equivalent of Ubuntu's 'build-essential', e.g. make, g++, etc.
```
sudo apt install build-essential
```


#### Windows Environment Setup

Go go https://nodejs.org, download and install the latest v12 of Node.js.

### Inbound Ports to Open

If you wish to run a node that writes ION DID operations, you will need to enable uPnP on your router or open ports `4002` and `4003` so that the operation data files can be served to others via IPFS.

## 2. Setting up Bitcoin Core

An ION node needs a trusted Bitcoin peer for fetching and writing ION transactions. We use Bitcoin Core for this.

### Automated script for installing Bitcoin Core on Linux

If you would like to install and start Bitcoin Core automatically on Linux, you can review and run the automated script committed in the [Sidetree repo](https://github.com/decentralized-identity/sidetree/blob/master/lib/bitcoin/setup.sh).

> NOTE: Initial synchronization takes ~2 hours for testnet on a 2 core machine with an SSD.

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
txindex=1
```

Start Bitcoin Core and let it sync with Testnet:

```
./bin/bitcoind --config bitcoin.conf
```
> You can add `--daemon` to run bitcoind as a daemon process.

#### On Windows:

Running Bitcoin Core with friendly UI after install:

```
bitcoin-qt.exe -testnet -datadir=<path-to-store-data> -server -rpcuser=<you-rpc-username> -rpcpassword=<your-rpc-password> -txindex=1
```


## 3. Installing Go-IPFS

Follow the instruction found at [IPFS website](https://docs.ipfs.io/install/) to install Go-IPFS, you can install the IPFS Desktop which internally installs Go-IPFS, it provides you with a user friendly UI.

## 4. Setting up MongoDB

### On Linux:

The default persistence option for storing data locally is MongoDB, though it is possible to create adapters for other datastores. To use the default MongoDB option, you'll need to install MongoDB community build:

- Download as a `deb` package: https://www.mongodb.com/download-center/community.
- Installation doc: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

> NOTE: You may not have all the dependencies required to run MongoDB, if so you can run `sudo apt-get install -f` to bring them in.

You'll probably want to store the data from the Mongo instance in the same drive you chose to store the blockchain data, due to the large amount of storage required. Set the directory for this by creating a `db` folder in the location you chose and run `mongod --dbpath ~/YOUR_LOCATION/db`

### On Windows:

Download and install MongoDB from https://www.mongodb.com/download-center/community.

> NOTE: To view MongoDB files with a more approachable GUI, download and install MongoDB Compass: https://docs.mongodb.com/compass/master/install/

## 5. Configure & Build ION Microservices

Clone https://github.com/decentralized-identity/ion:
```
git clone https://github.com/decentralized-identity/ion
```

Update the configuration for the ION Bitcoin microservice under `json/testnet-bitcoin-config.json`:

  - `bitcoinPeerUri`
    - Ensure it points to the RPC endpoint of the Bitcoin Core client you setup earlier in this guide (e.g. `http://localhost:18332` for testnet and `http://localhost:8332` for mainnet with default Bitcoin Core configuration).
  - `bitcoinDataDirectory`
    - It needs to point to the block files folder:
      - mainnet: exactly the same as the `datadir` value configured for Bitcoin Core.
      - testnet: `<datadir>/testnet3`.
  - `bitcoinWalletImportString`
    - Populated it with your private key if you intend to write DID operations, else just use any generated import string without any bitcoin.
  - `bitcoinRpcUsername` & `bitcoinPrcPassword`
    - Official Bitcoin Core client PRC API requires authentication, so make sure the are populated correctly.
  - `mongoDbConnectionString`
    - Point to your MongoDB if you need to change the endpoint. The existing config points to the default endpoint: `mongodb://localhost:27017/`.
  
Update the configuration for the ION core service under `json/testnet-core-config.json`:
  - `didMethodName`
    - testnet: `ion:test`
    - mainnet: `ion`
  - `ipfsHttpApiEndpointUri`
    - Point it to the Go-IPFS HTTP API endpoint. The existing config points to the default endpoint: `http://127.0.0.1:5001`.
  - `mongoDbConnectionString`
    - Point to your MongoDB if you need to change the endpoint. The existing config points to the default endpoint: `mongodb://localhost:27017/`.

Run the following commands to build ION:
```
npm i
npm run build
```

> NOTE: You must rerun `npm run build` every time a configuration JSON file is modified.


## 6. Run ION Bitcoin microservice
```
npm run bitcoin
```

This service will fail to start until your Bitcoin Core client has blocks past the ION genesis block. Please wait and try again later if this happens.


## 7. Run ION core service

Start a new console and run the following command to start the core service. This service will fail to start until your ION Bitcoin service has started successfully.

```
npm run core
```

Give it some time to synchronize ION transactions.

Verify ION is running properly by checking the following DID resolution in your browser:

testnet:
[http://localhost:3000/identifiers/did:ion:test:EiBFsUlzmZ3zJtSFeQKwJNtngjmB51ehMWWDuptf9b4Bag](http://localhost:3000/did:ion:test:EiBFsUlzmZ3zJtSFeQKwJNtngjmB51ehMWWDuptf9b4Bag)

mainnet:
[http://localhost:3000/identifiers/did:ion:EiB18LV2dAdALwCVx10mnLxIFd3XhrlhFOqel7v5wVpNEA](http://localhost:3000/identifiers/did:ion:EiB18LV2dAdALwCVx10mnLxIFd3XhrlhFOqel7v5wVpNEA)
