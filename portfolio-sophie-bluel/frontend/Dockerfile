# syntax=docker/dockerfile:1

FROM node:lts-alpine3.16 AS development

WORKDIR /app

COPY . .

EXPOSE 5678

CMD [ "npx", "http-server" ]
