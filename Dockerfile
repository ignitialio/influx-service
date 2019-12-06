FROM node:12-alpine

RUN mkdir -p /opt && mkdir -p /opt/influx

ADD . /opt/influx

WORKDIR /opt/influx

RUN npm install && npm run client:build

CMD ["node", "./server/index.js"]
