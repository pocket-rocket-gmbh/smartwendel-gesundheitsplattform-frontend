# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV PORT=3000 \
    HOST=0.0.0.0 \
    NODE_ENV=production

FROM base AS build
ENV NODE_ENV=development
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV CYPRESS_INSTALL_BINARY=0

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

COPY package.json package-lock.json ./
COPY . .
RUN npm ci || npm install
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
