---
description: Quick start for new developers or setting up a fresh environment
---

# Quick Start Workflow

## Prerequisites
- Docker installed
- Access to Cloudflare account (for tunnel tokens)
- SSH access to home server (if deploying)

## Setup Steps

1. **Clone and navigate**
   ```bash
   git clone https://github.com/deduhans/poker-results-tracker.git
   cd poker-results-tracker
   ```

2. **Copy environment files**
   ```bash
   cp .env.prod.example .env.prod
   cp .env.dev.example .env.dev
   ```

3. **Fill in environment variables**
   Edit `.env.prod` and `.env.dev` with your secrets:
   - Database credentials
   - `PASSPORT_SECRET` (generate random string)
   - `CLOUDFLARE_TUNNEL_TOKEN` (from Cloudflare dashboard)

4. **Start development**
   ```bash
   docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
   ```

5. **Verify running**
   - Frontend: http://localhost:8181 or http://<lan-ip>:8181
   - API: http://<lan-ip>:3101/health
   - Swagger docs: http://<lan-ip>:3101/api
