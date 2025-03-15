FROM node:alpine

RUN apk update && \
    apk add --no-cache netcat-openbsd

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD npm run start:$NODE_ENV