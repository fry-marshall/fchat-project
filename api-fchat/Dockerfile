FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS dev
COPY . .

FROM base AS prod
COPY . .
RUN npx typeorm migration:generate src/migrations/init -d src/data-source.ts
RUN npm run build