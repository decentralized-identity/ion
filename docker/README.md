# ION using Docker 

This directory contains the automated Docker deployment of ION. 


# Running an ION node using Docker
Running a ION node using docker is as simple as executing a docker command once docker engine is installed. This will create 5 docker containers that contain the core components to run an ION node.

- `mongo` - This is the local MongoDB used by the ION node.
- `bitcoin-core` - This container will run the Bitcoin Core client.
- `ipfs` - This is the local IPFS node used by the ION node.
- `ion-bitcoin` - This is the ION service interacting with Bitcoin Core.
- `ion-core` - This is the ION Core service.

> NOTE: currently the docker image only supports running a read-only ION node.

## Prerequisites

This implementation is designed to be run with very little dependencies beyond beyond a docker engine.

### Linux Host

- Linux Ubuntu 18.04LTS

- Docker engine (latest) (from https://docs.docker.com/engine/install/ubuntu/)
  ```
  sudo apt-get update

  sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

  curl -fsSL --max-time 10 --retry 3 --retry-delay 3 --retry-max-time 60 https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

  sudo apt-get install -y docker-ce
  sudo systemctl enable docker
  ```

- Docker compose (latest)
  ```
  sudo curl -L --max-time 60 --retry 3 --retry-delay 3 --retry-max-time 100 "https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

  sudo chmod +x /usr/local/bin/docker-compose
  ```

### MacOS Host
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

## Run

You will first need to download the `docker-compose.*` files in this directory before you can run the docker command to start an ION node. You can either clone the entire repo or just copy the few files locally manually. To clone the entire repo:

```
git clone https://github.com/decentralized-identity/ion.git
```

Once you've downloaded the docker files locally, `cd` into the directory containing the `docker-compose` files, then:

- To run a `mainnet` ION node:
```sh
docker-compose up -d
```

- To run a `testnet` ION node:

```sh
docker-compose -f docker-compose.yml -f docker-compose.testnet-override.yml up -d
```

That's it! An ION node should be starting up.

The initial synchronization will take at least 24 hours to complete for `mainnet` (quicker for `testnet`), based on your machine and internet connectivity speed. The long initialization time is primarily because ION requires a full bitcoin node for its trustless setup, and downloading the entire bitcoin blockchain takes a very long time. Sync progress is logged by the `ion-bitcoin` service.

> NOTE: For bitcoin `mainnet`, you will be downloading at least _450 GB_ worth of blockchain data, thus you will also need at least that must local storage space.

> NOTE: the dockers containers expose their service ports so that requests can be sent from the host machine for debugging purposes.

## Customize ION Data Directory
You can customize the location where all ION data generated is stored by specifying it in the `ION_DATA_VOLUME` variable.

This is especially useful if you already have a copy of the fully synchronized bitcoin data, allowing you to avoid downloading the entire bitcoin blockchain again. Just pass the custom path to `docker-compose` like so:


```sh
ION_DATA_VOLUME=<custom_data_path> docker-compose up -d
```

The `docker-compose` files assumes the following directory structure:

```
<custom_data_path>
  |
  |-- bitcoin
  |
  |-- ipfs
  |
  |-- mongo
```

# Building a Multi-Platform ION Image
For developers only. Ignore this section if you looking to just run an ION node using docker. If you don't care about multi-platform support, ignore rest of this section, just run:

  `docker build -t <repository>:<tag> -f dockerfile ../`

  e.g. `docker build -t thehenrytsai/ion:1.0.4 -f dockerfile ../`

## Prerequisites

- You must use `docker buildx` instead of `docker build`, this should come installed with Docker Desktop.

- Default build driver does not support building multi-platform images. You will have to create a separate `BuildKit` build driver instance by running:
  
  `docker buildx create --name <custom_name> --use`
  - `--name` - if not specified a name will be generated for you
  - `--use` - sets this instance as the default build instance
  - By default `buildx create` creates a new build instance using `BuildKit` container driver, which is what we want. This is equivalent to specifying the parameter explicitly: `--driver docker-container`

- You can use `docker buildx ls` to list the build driver instances to verify you have created the `BuildKit` instance.

## Building the Docker Image
- `npm i` followed by `npm run build` in root directory.
- `cd` into the `docker` directory, run:

- Run the `buildx` command to build the multi-platform image:

`docker buildx build --platform=linux/arm64,linux/amd64 --push -t <repository>:<tag> -f dockerfile ../`

  e.g. `docker buildx build --platform=linux/arm64,linux/amd64 --push -t thehenrytsai/ion:1.0.4 -f dockerfile ../`

  - `--platform` - specifies the platforms this images will be built for
  - `--push` - pushes the image to the specified repository
