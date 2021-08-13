# syntax=docker/dockerfile:1
FROM node:12.19.0
ENV NODE_ENV=production


WORKDIR /app/src
COPY . .

RUN npm install

CMD [ "node", "server.js" ]