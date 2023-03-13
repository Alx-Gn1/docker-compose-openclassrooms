# syntax=docker/dockerfile:1

FROM node:lts-alpine3.16 AS development

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 5080

CMD [ "npx", "nodemon", "server" ]
