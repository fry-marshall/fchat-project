FROM node:alpine

RUN apk update && \
    apk add --no-cache netcat-openbsd

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
RUN chmod +x wait-for-db.sh
RUN npx tsc