# Poker Results Tracker - AI Assistant Rules

## Project Overview
Monorepo for a Poker Results Tracker application with NestJS backend, Vue.js frontend, PostgreSQL database, deployed via Docker and Cloudflare Tunnel.

**Live URLs:**
- Production: https://pokerrt.com
- Dev (planned): https://dev.pokerrt.com

## Tech Stack

### Backend (`be/`)
- **Framework:** NestJS 11 with Express
- **Database:** PostgreSQL 15 via TypeORM
- **Auth:** Passport JWT (passport-jwt)
- **API Docs:** Swagger (@nestjs/swagger)
- **Testing:** Jest
- **Runtime:** Node.js 22 (Docker)

### Frontend (`fe/`)
- **Framework:** Vue 3 + TypeScript
- **UI Library:** Vuetify 3
- **State:** Pinia
- **Build Tool:** Vite 5
- **Testing:** Vitest, Cypress, Playwright
- **Server:** Caddy 2 (Docker)

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Caddy (handles frontend + API proxy)
- **Public Access:** Cloudflare Tunnel (no port forwarding needed)
- **CI/CD:** GitHub Actions (manual workflow_dispatch triggers)
- **SSH Access:** Cloudflare Tunnel (ssh.pokerrt.com)

## Critical Rules

### Code Style
- Do not add comments to code (user preference)
- Use TypeScript strict mode compliance
- Follow existing project patterns (check similar files first)

### Docker & Deployment
- **Prod:** `docker compose --env-file .env.prod up -d --build`
- **Dev:** `docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build`
- Environment files (`.env.prod`, `.env.dev`) are gitignored - only edit `.env.*.example`
- Caddy uses `auto_https off` (Cloudflare handles TLS)
- Frontend binds to `:80` (not domain name) for healthcheck compatibility
- Never commit secrets or production env files

### Database
- TypeORM with `DB_SYNCHRONIZE` for dev (auto-creates tables)
- Migrations preferred for production changes
- Separate databases for prod (`poker_prod`) and dev (`poker_dev`)

### Git Workflow
- `main` branch → production deploy (manual)
- `dev` branch → development deploy (manual)
- Use `git fetch && git reset --hard origin/<branch>` in CI/CD (not pull)

### Environment Variables (Critical)
Key variables that must be set correctly:
- `CLIENT_HOST` - Frontend URL (dev: https://dev.pokerrt.com, prod: https://pokerrt.com)
- `CLIENT_PORT` - Always `443` for production/dev (not 80/8181)
- `CADDY_HOST` - Always `:80` (binds to all interfaces)
- `CADDY_BACKEND` - Docker service name (e.g., `poker-nestapp:3000`)
- `CLOUDFLARE_TUNNEL_TOKEN` / `CLOUDFLARE_TUNNEL_TOKEN_DEV` - For cloudflared containers
- `PASSPORT_SECRET` - JWT signing secret
- `DB_SYNCHRONIZE` - `true` for dev, `false` for prod

### Testing
- Backend tests: `npm test` (Jest)
- Frontend unit: `npm run test:unit` (Vitest)
- Frontend E2E: `npm run playwright` or Cypress

## Common Tasks

### Adding a new API endpoint
1. Create controller method in `be/src/<module>/`
2. Add DTO for request/response validation
3. Update service layer
4. Add Swagger decorators for docs
5. Test locally via `docker compose up`

### Adding a new frontend page
1. Create Vue component in `fe/src/views/` or `fe/src/components/`
2. Add route in `fe/src/router/index.ts`
3. Create Pinia store if state management needed
4. Use Vuetify components for UI consistency
5. Test via LAN IP: `http://<lan-ip>:8181`

### Deploying changes
1. Push to `dev` branch → trigger "Deploy Dev" workflow manually in GitHub
2. Test at dev URL
3. Merge to `main` → trigger "Deploy Production" workflow manually

## File Structure
```
/
├── be/                    # NestJS backend
│   ├── src/
│   │   ├── modules/       # Feature modules (auth, users, etc.)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── fe/                    # Vue frontend
│   ├── src/
│   │   ├── views/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── stores/        # Pinia stores
│   │   └── router/
│   ├── Caddyfile
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/     # CI/CD
│   ├── deploy-dev.yml
│   └── deploy-prod.yml
├── docker-compose.yml     # Production stack
├── docker-compose.dev.yml # Development stack
└── .env.*.example         # Environment templates
```

## Troubleshooting

### Container unhealthy
- Check Caddy binding: must be `:80` not domain name
- Verify healthcheck port matches Caddy port

### Database connection issues
- Verify `POSTGRES_HOST` points to service name (e.g., `postgres-dev`)
- Check `DB_SYNCHRONIZE` is set correctly
- For new tables: ensure container restarts with fresh volume if needed

### GitHub Actions SSH failures
- Verify `SERVER_APP_PATH` secret matches actual repo path on server
- Check `ssh.pokerrt.com` tunnel is running: `sudo systemctl status cloudflared`
- Confirm cloudflared SSH service is active on server
