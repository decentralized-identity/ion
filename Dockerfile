# ---------------------- Builder image ----------------------

FROM node:12-slim AS builder

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

RUN rm -rf src/

# ---------------------- Runtime image ----------------------

FROM node:12-slim

WORKDIR /app

COPY --from=builder /app .

CMD [ "npm", "start" ]
