# Deploy to Oracle Cloud

Deploy the backend to the Oracle Cloud Always Free VM via SSH.

## Steps

1. Read `scripts/deploy-oracle.sh` to understand the current deploy script.
2. Read `.github/workflows/ci.yml` to understand the CI/CD pipeline.
3. Check that the current branch is `main` (or warn the user if not).
4. Run the security checklist: confirm there are no hardcoded secrets in changed files (check for patterns like `password =`, `secret =`, `jdbc:postgresql://` with credentials embedded).
5. Remind the user what the deploy will do:
   - GitHub Actions SSH into Oracle Cloud VM
   - `git pull origin main`
   - `docker compose up --build -d` (rebuilds backend container)
   - Nginx reverse proxies port 80/443 → port 8080
6. Ask the user to confirm before proceeding.
7. If confirmed, remind them to push to `main` so GitHub Actions triggers the deploy:
   ```bash
   git push origin main
   ```
8. Tell them to monitor the deploy at: GitHub → Actions tab → `ci.yml` workflow.

## Manual SSH Deploy (if CI fails)

If GitHub Actions fails, the user can deploy manually:

```bash
# SSH into VM
ssh ubuntu@<ORACLE_VM_IP>

# On the VM
cd ~/my-portfolio
git pull origin main
docker compose up --build -d backend

# Check logs
docker compose logs -f backend
```

## Rollback

```bash
# SSH into VM
ssh ubuntu@<ORACLE_VM_IP>
cd ~/my-portfolio
git log --oneline -5          # find last good commit
git checkout <commit-hash>
docker compose up --build -d backend
```

## Health Check

After deploy, verify the backend is running:
```bash
curl https://<ORACLE_VM_IP>/api/profiles
# or via frontend proxy:
curl https://quangtrung.store/api/profiles
```
