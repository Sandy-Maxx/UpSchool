# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies separately for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm i

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built assets
COPY --from=base /app/dist /usr/share/nginx/html

# Nginx default conf for single-page app routing
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

