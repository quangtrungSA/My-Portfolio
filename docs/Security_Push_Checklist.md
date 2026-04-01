# Security Checklist - Before Pushing Code

**CRITICAL: Never push sensitive credentials to Git repositories.**

---

## 1. Files That MUST Be in `.gitignore`

```
# Already in .gitignore - VERIFY before every push
.env
.env.local
*.env
backend/src/main/resources/application-local.yml
```

## 2. Sensitive Data in This Project

### Database Credentials (Neon PostgreSQL)

| Item | File | Status |
|------|------|--------|
| `NEON_JDBC_URL` | `backend/src/main/resources/application.yml` | **EXPOSED - Must fix before push** |
| `NEON_USERNAME` | `backend/src/main/resources/application.yml` | **EXPOSED - Must fix before push** |
| `NEON_PASSWORD` | `backend/src/main/resources/application.yml` | **EXPOSED - Must fix before push** |

### JWT Secret

| Item | File | Status |
|------|------|--------|
| `JWT_SECRET` | `backend/src/main/resources/application.yml` | Uses default fallback - **Change in production** |

### Mail Credentials

| Item | File | Status |
|------|------|--------|
| `MAIL_USERNAME` | `backend/src/main/resources/application.yml` | Empty by default - OK |
| `MAIL_PASSWORD` | `backend/src/main/resources/application.yml` | Empty by default - OK |

---

## 3. How to Fix Before Push

### Step 1: Move secrets to environment variables

Replace hardcoded values in `application.yml` with env var references:

```yaml
# BEFORE (DANGEROUS - contains real credentials)
spring:
  datasource:
    url: jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require
    username: neondb_owner
    password: npg_xxxxx

# AFTER (SAFE - uses environment variables)
spring:
  datasource:
    url: ${NEON_JDBC_URL}
    username: ${NEON_USERNAME}
    password: ${NEON_PASSWORD}
```

### Step 2: Create local env file (NOT committed)

Create `backend/.env` (already gitignored):
```bash
NEON_JDBC_URL=jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require
NEON_USERNAME=neondb_owner
NEON_PASSWORD=npg_xxxxx
JWT_SECRET=your-production-secret-key-here
```

### Step 3: Verify `.gitignore` covers everything

```bash
# Run this command to check if any sensitive files would be committed
git status --porcelain | grep -E "\.env|application-local|id_rsa|\.pem|\.key"
```

---

## 4. SSH Keys - NEVER Commit

| File Pattern | Description | Action |
|-------------|-------------|--------|
| `id_rsa` / `id_ed25519` | SSH private keys | **NEVER commit** |
| `id_rsa.pub` / `id_ed25519.pub` | SSH public keys | Avoid committing |
| `*.pem` | PEM certificates/keys | **NEVER commit** |
| `*.key` | Private key files | **NEVER commit** |
| `known_hosts` | SSH known hosts | Avoid committing |
| `~/.ssh/config` | SSH config | Avoid committing |

Add to `.gitignore`:
```
# SSH Keys
*.pem
*.key
id_rsa
id_ed25519
id_rsa.pub
id_ed25519.pub
```

---

## 5. API Keys & Tokens - NEVER Commit

| Type | Example Pattern | Action |
|------|----------------|--------|
| API keys | `sk-xxx`, `pk_xxx`, `api_xxx` | Use env vars |
| AWS credentials | `AKIA...`, `aws_secret_access_key` | Use env vars or `~/.aws/credentials` |
| Firebase config | `firebaseConfig = {...}` | Use env vars |
| OAuth secrets | `client_secret`, `refresh_token` | Use env vars |
| JWT secrets | Long random strings | Use env vars |
| Database passwords | Any `password = "..."` | Use env vars |

---

## 6. Pre-Push Checklist

Run these checks EVERY TIME before `git push`:

```bash
# 1. Search for hardcoded passwords
grep -rn "password" --include="*.yml" --include="*.yaml" --include="*.properties" backend/src/main/resources/

# 2. Search for hardcoded secrets
grep -rn "secret\|token\|apikey\|api_key" --include="*.yml" --include="*.yaml" --include="*.ts" --include="*.java" .

# 3. Search for SSH keys
find . -name "id_rsa" -o -name "id_ed25519" -o -name "*.pem" -o -name "*.key" 2>/dev/null

# 4. Search for .env files that might slip through
find . -name ".env*" -not -path "./node_modules/*" 2>/dev/null

# 5. Check git status for sensitive files
git diff --cached --name-only | grep -iE "env|secret|key|credential|password|token"

# 6. Check for Neon connection strings
grep -rn "npg_\|neondb_owner\|ep-.*neon\.tech" . --include="*.yml" --include="*.yaml" --include="*.ts" --include="*.java" 2>/dev/null
```

---

## 7. If You Accidentally Pushed Secrets

### Immediate actions:

1. **Rotate the credential immediately** (change password on Neon, regenerate JWT secret)
2. **Remove from git history:**
   ```bash
   # Remove file from all history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/secret/file" \
     --prune-empty --tag-name-filter cat -- --all

   # Force push (destructive - coordinate with team)
   git push origin --force --all
   ```
3. **Consider the credential compromised** - even after removal, bots may have already scraped it
4. **Check Neon dashboard** for unauthorized access

### GitHub Secret Scanning

GitHub automatically scans for common secret patterns. If you receive a notification:
- Rotate the credential **immediately**
- Do NOT just delete the commit - the secret is already exposed

---

## 8. Recommended Git Hooks

Create `.git/hooks/pre-commit` to auto-check:

```bash
#!/bin/bash
# Pre-commit hook: block commits with secrets

PATTERNS="npg_|neondb_owner|AKIA|sk-live|password.*=.*['\"][^$]|secret.*=.*['\"][^$]"

if git diff --cached --diff-filter=ACM | grep -iE "$PATTERNS" > /dev/null 2>&1; then
  echo "ERROR: Potential secret detected in staged files!"
  echo "Please remove credentials and use environment variables."
  git diff --cached --diff-filter=ACM | grep -inE "$PATTERNS"
  exit 1
fi
```

Make it executable: `chmod +x .git/hooks/pre-commit`

---

## Summary

| Rule | Priority |
|------|----------|
| Never hardcode database credentials in committed files | **CRITICAL** |
| Never commit SSH private keys (id_rsa, *.pem, *.key) | **CRITICAL** |
| Never commit API keys or tokens | **CRITICAL** |
| Always use environment variables for secrets | **REQUIRED** |
| Always check `git diff` before committing | **REQUIRED** |
| Set up pre-commit hooks for secret detection | **RECOMMENDED** |
| Rotate credentials immediately if exposed | **CRITICAL** |
