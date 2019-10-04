FROM node:12

RUN apt-get update
RUN apt-get -y install netcat

WORKDIR /usr/src/app

COPY ./feature/package.json ./

RUN npm install

COPY ./feature ./
COPY ./waitfor.sh /waitfor.sh

EXPOSE 3000