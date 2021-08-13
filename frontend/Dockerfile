# syntax=docker/dockerfile:1
FROM node:12.19.0
ENV NODE_ENV=production

WORKDIR /app
COPY . .

RUN npm install --also=dev

CMD [ "npm", "run", "prod" ]