# syntax=docker/dockerfile:1.4
FROM node:22-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application source code
COPY . .

# Build the application
RUN npm run build-only

# Production stage using Caddy
FROM caddy:2-alpine

# Copy built files from build stage to Caddy's site directory
COPY --from=build-stage /app/dist /srv

# Copy Caddy configuration
COPY ./Caddyfile /etc/caddy/Caddyfile

# Expose port 80
EXPOSE 80
