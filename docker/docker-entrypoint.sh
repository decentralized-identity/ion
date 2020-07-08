#!/bin/bash

set -e

if [ "$1" = 'core' ]; then
    echo "Starting up core servce"
    npm run start:core
fi

if [ "$1" = 'bitcoin' ]; then
    echo "Starting up bitcoin servce"
    npm run start:bitcoin
fi

if [ "$1" = 'ipfs' ]; then
    echo "Starting up ipfs servce"
    npm run start:ipfs
fi