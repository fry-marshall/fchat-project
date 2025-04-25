FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS dev
RUN npm ci
COPY . .

FROM base AS prod
RUN npm ci --omit=dev
COPY . .
RUN npm run build