# Security Checklist

Run the pre-push security checklist for the portfolio project.

This checks all staged/changed files for common security issues before pushing to GitHub.

## Steps

### 1. Get the list of changed files

```bash
git diff --name-only HEAD
git diff --name-only --staged
```

### 2. Check for hardcoded secrets

Search changed files for patterns that should never be committed:

- JDBC URLs with credentials: `jdbc:postgresql://.*:.*@`
- Passwords/secrets assigned: `password\s*=\s*["\'][^"\'\$\{]`
- JWT secrets: `jwt.*secret\s*=\s*["\']`
- API keys: `api[_-]?key\s*=\s*["\']`
- Private keys/certificates: `BEGIN.*PRIVATE KEY`
- AWS/Oracle credentials: `AKIA`, `ocid1\.`

Use Grep on each changed file. If any secrets are found, **stop and alert the user immediately**.

### 3. Check .gitignore covers sensitive files

Read `.gitignore` and verify these patterns are present:
- `.env`
- `.env.local`
- `*.pem`, `*.key`
- `backend/.env`

### 4. Check for debug/dev leftovers

Search changed files for:
- `console.log(` with sensitive data (token, password, secret, jwt)
- `System.out.println(` in Java files (acceptable for debug, flag if contains user data)
- `TODO: remove` comments
- `localhost` hardcoded in production config files (`application.yml`, `next.config.mjs`)

### 5. Check application.yml

Read `backend/src/main/resources/application.yml`:
- `${NEON_JDBC_URL}` — must use env var, not hardcoded URL
- `${JWT_SECRET}` — must use env var
- `ddl-auto: none` — must NOT be `create` or `create-drop`
- `show-sql: false` — should be false in production profile

### 6. Check middleware.ts routes

Read `frontend/src/middleware.ts`:
- `/api/auth/*` must go to Next.js routes (not backend proxy)
- Admin routes must require authentication check

### 7. Report results

Output a summary:
```
Security Check Results
======================
[PASS] No hardcoded secrets found
[PASS] .gitignore covers sensitive files
[WARN] console.log found in frontend/src/components/... (line X) — review if sensitive
[PASS] application.yml uses env vars
[PASS] middleware.ts auth routes correct

Overall: SAFE TO PUSH  (or)  ISSUES FOUND — fix before pushing
```

If any `[FAIL]` items exist, list exact file:line references and do not recommend pushing.
