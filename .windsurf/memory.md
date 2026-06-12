# Poker Results Tracker - Project Memory

## Deployment Status

### Production (pokerrt.com)
- **Status:** Active and deployed
- **Infrastructure:** Home server via Cloudflare Tunnel
- **Database:** PostgreSQL with existing data
- **CI/CD:** Manual trigger via GitHub Actions

### Development (dev.pokerrt.com)
- **Status:** Infrastructure ready, tunnel needs Cloudflare setup
- **Stack:** Running on same server as prod (isolated containers)
- **Access:** LAN at port 8181, or via subdomain when tunnel configured
- **Database:** Separate dev database (`poker_dev`)

## Architecture Decisions

### Why Cloudflare Tunnel?
- No router port forwarding required
- Automatic HTTPS (TLS termination at Cloudflare edge)
- Free tier sufficient for personal projects
- SSH access also tunneled for secure CI/CD

### Why Caddy as reverse proxy?
- Simple configuration with Caddyfile
- Automatic HTTP→HTTPS redirects (disabled for Tunnel use)
- Single container serves frontend + proxies API

### Monorepo Structure
- Backend and frontend share Docker Compose orchestration
- Separate package.json and dependency management
- Unified deployment via GitHub Actions

## Secrets & Configuration

### GitHub Secrets (Required)
| Secret | Purpose |
|--------|---------|
| SERVER_USER | SSH username (deduhan) |
| SERVER_SSH_KEY | Private key for SSH auth |
| SERVER_APP_PATH | `/home/deduhan/poker-results-tracker` |

### Server Configuration
- **SSH Tunnel:** `ssh.pokerrt.com` via cloudflared service
- **Docker:** Rootless or standard setup
- **Git:** Repo at `~/poker-results-tracker`

### Cloudflare Tunnels
| Tunnel | Purpose | Status |
|--------|---------|--------|
| pokerrt-prod | Production app | Active |
| pokerrt-dev | Dev app | Token needed in `.env.dev` |
| ssh-tunnel | SSH access for CI/CD | Active |

## Known Issues & Solutions

### 1. Git divergent branches in CI/CD
**Problem:** `git pull` fails with "Need to specify how to reconcile divergent branches"
**Solution:** Use `git fetch && git reset --hard origin/<branch>` instead of pull

### 2. Caddy healthcheck fails
**Problem:** Container shows unhealthy
**Cause:** Caddy binding to domain name instead of `:80`
**Solution:** Set `CADDY_HOST=:80` in env file

### 3. SSH via GitHub Actions timeout
**Problem:** `dial tcp: i/o timeout` connecting to server
**Cause:** Server behind home network, no public IP
**Solution:** Cloudflare Tunnel for SSH access (`ssh.pokerrt.com`)

### 4. Database tables not created
**Problem:** "relation does not exist" errors
**Cause:** `DB_SYNCHRONIZE` hardcoded to false or not set
**Solution:** Use `${DB_SYNCHRONIZE:-false}` in docker-compose to allow override

## Development Patterns

### Adding Features
1. Start with backend: entity → service → controller → DTO
2. Test API via Swagger UI (available at `/api` when running)
3. Build frontend components using existing patterns
4. Use Pinia stores for state that crosses components
5. Test E2E with Playwright for critical flows

### Code Organization
- Backend follows NestJS module pattern
- Frontend uses feature-based organization
- Shared types/interfaces: define in backend, frontend mirrors if needed

## Future Improvements (TODO)
- [ ] Set up dev.pokerrt.com subdomain in Cloudflare
- [ ] Add database migrations (TypeORM)
- [ ] Implement backup strategy for PostgreSQL
- [ ] Add monitoring/alerting for container health
- [ ] Consider adding staging environment

## Commands Quick Reference

### Local Development
```bash
# Full dev stack
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build

# Check logs
docker compose -f docker-compose.dev.yml logs -f

# Database reset
docker compose -f docker-compose.dev.yml down -v
```

### Production Management
```bash
# Deploy manually on server
cd ~/poker-results-tracker
git pull origin main
docker compose --env-file .env.prod up -d --build

# View logs
docker compose --env-file .env.prod logs -f

# SSH tunnel status
sudo systemctl status cloudflared
```

### Testing
```bash
# Backend (in be/)
npm test

# Frontend (in fe/)
npm run test:unit
npm run playwright
```
