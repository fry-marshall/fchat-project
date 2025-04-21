FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-cache

FROM base AS dev
COPY . .

FROM base AS prod
COPY . .
RUN npm run build