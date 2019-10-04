FROM node:12 as build

WORKDIR /build

COPY ./client/package*.json ./

RUN npm install

COPY ./client .

RUN npm run build

FROM nginx

COPY --from=build  /build/dist/ /usr/share/nginx/html/

RUN chown -R nginx /usr/share/nginx

ARG stage='prod'

COPY ./client/nginx.${stage}.conf /etc/nginx/nginx.conf