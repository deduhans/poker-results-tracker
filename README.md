# Poker Results Tracker

NestJS backend + Vue.js frontend + PostgreSQL, served via Caddy and deployed via Cloudflare Tunnel.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.prod.example .env.prod
cp .env.dev.example .env.dev
```

## Development (LAN)

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
```

- Frontend: `http://<your-lan-ip>:8181`
- Backend API: `http://<your-lan-ip>:3101`

## Production (Home Server)

```bash
docker compose --env-file .env.prod up -d --build
```

Accessible publicly via `https://pokerrt.com` through Cloudflare Tunnel.

## Architecture

| Container | Description |
|---|---|
| `poker-nestapp` | NestJS backend API |
| `poker-vueapp` | Vue.js frontend served by Caddy |
| `poker-postgres-prod` | PostgreSQL database |
| `poker-cloudflared` | Cloudflare Tunnel (prod only) |

## Stopping

```bash
docker compose --env-file .env.prod down
```

Remove all data including the database:

```bash
docker compose --env-file .env.prod down -v
```

## CI/CD

GitHub Actions deploys automatically:
- `main` branch → production
- `dev` branch → development (manual trigger)
