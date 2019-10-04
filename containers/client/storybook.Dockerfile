FROM node:12 as builder

WORKDIR /app
COPY ./client/package*.json ./
RUN npm install

FROM node:12
WORKDIR /app
RUN mkdir /save
COPY --from=builder /app/node_modules /save/node_modules