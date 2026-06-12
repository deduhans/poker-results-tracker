---
description: Troubleshooting deployment issues
---

# Debug Deployment Workflow

## SSH Connection Issues

### Problem: GitHub Actions can't connect to server

**Check SSH tunnel status:**
```bash
sudo systemctl status cloudflared
```

**Verify tunnel configuration:**
```bash
cat /etc/cloudflared/config.yml
```

**Restart if needed:**
```bash
sudo systemctl restart cloudflared
```

### Problem: Permission denied (SSH key)

**Verify key is correct in GitHub secrets:**
- Copy public key from server: `cat ~/.ssh/authorized_keys`
- Ensure GitHub secret matches private key format

## Container Issues

### Problem: Container shows unhealthy

**Check logs:**
```bash
docker compose --env-file .env.prod logs <service-name>
```

**Common causes:**
- Caddy not binding to `:80` → check `CADDY_HOST` env var
- Database not ready → check `depends_on` with condition
- Healthcheck port mismatch → verify ports in compose file

### Problem: Database connection failed

**Verify:**
```bash
# Check postgres is running
docker compose --env-file .env.prod ps postgres

# Check env vars are passed
docker compose --env-file .env.prod exec nestapp env | grep POSTGRES
```

## Git Issues

### Problem: Divergent branches error

**Already fixed in CI/CD** (uses `git reset --hard`)

**Manual fix on server:**
```bash
cd ~/poker-results-tracker
git fetch origin
git reset --hard origin/main  # or origin/dev
```

## Cloudflare Tunnel Issues

### Problem: Error 1033 (tunnel not found)

**Check token is valid:**
```bash
# Verify token in env file
cat .env.prod | grep CLOUDFLARE

# Restart tunnel container
docker compose --env-file .env.prod restart cloudflared
```

### Problem: SSH tunnel not working

**Verify SSH service config:**
```bash
cat /etc/cloudflared/config.yml
# Should contain:
# ingress:
#   - hostname: ssh.pokerrt.com
#     service: ssh://localhost:22
```

## Complete Reset (Nuclear Option)

```bash
# On server
cd ~/poker-results-tracker

# Stop everything
docker compose --env-file .env.prod down

# Pull latest
git fetch origin
git reset --hard origin/main

# Rebuild and start
docker compose --env-file .env.prod up -d --build

# Check status
docker compose --env-file .env.prod ps
```
