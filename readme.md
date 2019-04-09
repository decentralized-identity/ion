
<img src="images/logo.png" style="display: block; height: 12em; margin: 0 auto;"/>

ION is a public, permissionless, Decentralized Identifier (DID) network that implements the blockchain-agnostic Sidetree protocol on top of Bitcoin (as a 'Layer 2' overlay) to support DIDs/DPKI at scale.

## Key Points:

- ION is public and permissionless - the system is decentralized, no company, organization, or group owns/controls the identifiers and PKI entries in the system, and no one dictates who can participate.
- ION doesn't introduce new tokens/coins - Bitcoin is the only unit of value relevant in the operation of the on-chain aspects of the ION network.
- ION is not a sidechain or consensus system - the network nodes do not require any additional consensus mechanism.

## How does ION work?

By leveraging the blockchain-agnostic Sidetree protocol, ION makes it possible to anchor tens of thousands of DID/PKI operations on a target chain (in ION's case, Bitcoin) using a single on-chain transaction. The transactions are encoded with a hash that ION nodes use to fetch, store, and replicate the hash-associated DID operation batches via IPFS. The nodes process these batches of operations in accordance with a specific set of deterministic rules that enables them to independently arrive at the correct PKI state for IDs in the system, without requiring a separate consensus mechanism, blockchain, or sidechain. Nodes can fetch, process, and assemble DID states in parallel, allowing the aggregate capacity of nodes to run at tens of thousands of operations per second.

## Build Steps:

1. Build and run `sidetree-bitcoin` micro-service. This micro-service depends on a Bitcored node. Instructions can be found in the `sidetree-bitcoin` [README.md](https://github.com/decentralized-identity/sidetree-bitcoin).

1. Build and run `sidetree-ipfs` micro-service. Keep in mind soon you will need to build and run `sidetree-ipfs-reference` instead.
   1. Clone the repo and go to the root folder.
   1. Run `npm i` to install dependencies.
   1. Run `npm run build` to build the service.
   1. Run 'npm start` to start the service.
1. Build and run `sidetree-core` service which depends on the micro-services above. Keep in mind soon you will need to build and run `ion` instead.
   1. Install MongoDB on local machine (or subscribed a MongoDB cloud service), this is used to keep processed state. 
   1. Clone the repo and go to the root folder.
   1. Run `npm i` to install dependencies.
   1. Modify `json/config.json` accordingly. Parameters of interest:
      1. Update `operationStoreUri` to point to the MongoDB configured earlier.
      1. Update `didMethodName` to `did:ion:`;
   1. Run `npm run build` to build the service.
   1. Run 'npm start` to start the service. 

## Contribution Guidelines:

TBD

