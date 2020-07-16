# ---------------------- Builder image ----------------------
FROM node:10-slim as builder

# Set to root user
USER root

# Install git, python and build-essential as it required by some dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git python build-essential

# Create app directory
WORKDIR /app

# Copy required files
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
COPY bin ./bin
COPY tests ./tests
COPY docker/docker-entrypoint.sh ./entrypoint.sh

# Install node dependencies
RUN npm i

# Build project
RUN npm run build

# ---------------------- Runtime image ----------------------
FROM node:10-slim

# Set app directory
WORKDIR /app

# Copy file from build set requried directory permission to node user
COPY --from=builder --chown=node:node app/ .

# Set to node user
USER node

# Expose server port
EXPOSE 80

## Setup the entry point
ENTRYPOINT ["./entrypoint.sh"]