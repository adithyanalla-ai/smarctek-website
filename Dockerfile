# Build stage: generates dist/ (needs dev dependencies)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-audit --no-fund; fi
COPY . .
ARG TURNSTILE_SITE_KEY=""
ARG SITE_URL="https://www.smarctekllc.com"
ENV TURNSTILE_SITE_KEY=$TURNSTILE_SITE_KEY SITE_URL=$SITE_URL
RUN npm run build

# Runtime stage: zero runtime dependencies, just Node + dist/ + server/
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/dist ./dist
COPY server ./server
RUN mkdir -p data/enquiries && chown -R node:node /app
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
CMD ["node", "server/server.mjs"]
