
<img src="images/logo.png" style="display: block; height: 12em; margin: 0 auto;"/>

ION is a public, permissionless, Decentralized Identifier (DID) network that implements the blockchain-agnostic Sidetree protocol on top of Bitcoin (as a 'Layer 2' overlay) to support DIDs/DPKI at scale.

## Key Points:

- ION is public and permissionless - the system is decentralized, no company, organization, or group owns/controls the identifiers and PKI entries in the system, and no one dictates who can participate.
- ION doesn't introduce new tokens/coins - Bitcoin is the only unit of value relevant in the operation of the on-chain aspects of the ION network.
- ION is not a sidechain or consensus system - the network nodes do not require any additional consensus mechanism.

## How does ION work?

By leveraging the blockchain-agnostic Sidetree protocol, ION makes it possible to anchor tens of thousands of DID/PKI operations on a target chain (in ION's case, Bitcoin) using a single on-chain transaction. The transactions are encoded with a hash that ION nodes use to fetch, store, and replicate the hash-associated DID operation batches via IPFS. The nodes process these batches of operations in accordance with a specific set of deterministic rules that enables them to independently arrive at the correct PKI state for IDs in the system, without requiring a separate consensus mechanism, blockchain, or sidechain. Nodes can fetch, process, and assemble DID states in parallel, allowing the aggregate capacity of nodes to run at tens of thousands of operations per second.

## Building the project:

Please use the following guide to setup the various services that comprise an ION node: [ION Installation Guide](https://github.com/decentralized-identity/ion/blob/master/install-guide.md)

## Contribution Guidelines:

TBD

