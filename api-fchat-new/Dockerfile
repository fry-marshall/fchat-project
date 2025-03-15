# Étape 1 : Base commune
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-cache

# Étape 2 : Développement
FROM base AS dev
COPY . .

# Étape 3 : Production
FROM base AS prod
COPY . .
RUN npm run build