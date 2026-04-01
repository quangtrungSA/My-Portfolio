# Deployment Guide

## Architecture

```
User Browser
    │
    ▼
Vercel (Frontend)          Render (Backend)           Neon (Database)
Next.js 14                 Spring Boot 3.4            PostgreSQL 17
*.vercel.app               *.onrender.com             *.neon.tech
    │                          │                          │
    └── /api/* rewrites ──────►│                          │
                               └── JDBC ─────────────────►│
```

---

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
- Go to https://render.com and sign up (free)
- Connect your GitHub account

### 1.2 Create New Web Service
1. Click **"New" → "Web Service"**
2. Connect repository: `quangtrungSA/My-Portfolio`
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `portfolio-backend` |
| **Region** | Singapore (closest to Vietnam) |
| **Root Directory** | `backend` |
| **Runtime** | Docker |
| **Plan** | Free |

### 1.3 Add Environment Variables
In Render dashboard → Environment tab:

| Key | Value |
|-----|-------|
| `NEON_JDBC_URL` | `jdbc:postgresql://ep-old-dew-a1nr825s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `NEON_USERNAME` | `neondb_owner` |
| `NEON_PASSWORD` | *(your Neon password)* |
| `JWT_SECRET` | *(generate a strong 64+ char random string)* |

### 1.4 Deploy
Click **"Create Web Service"** → Render will build and deploy automatically.

After deploy, note the URL: `https://portfolio-backend-xxxx.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
- Go to https://vercel.com and sign up (free)
- Connect your GitHub account

### 2.2 Import Project
1. Click **"Add New" → "Project"**
2. Import repository: `quangtrungSA/My-Portfolio`
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `pnpm build` |
| **Install Command** | `pnpm install` |
| **Output Directory** | `.next` |

### 2.3 Add Environment Variables
| Key | Value |
|-----|-------|
| `API_URL` | `https://portfolio-backend-xxxx.onrender.com` *(your Render URL)* |

### 2.4 Deploy
Click **"Deploy"** → Vercel will build and deploy automatically.

Your site will be live at: `https://my-portfolio-xxxx.vercel.app`

---

## Step 3: Verify

1. Open your Vercel URL → Portfolio should load
2. Check `/api/profiles` → Should return profile data (proxied through Vercel to Render)
3. Go to `/admin/login` → Login with admin/changeme
4. Test CRUD operations in admin panel

---

## Notes

### Render Free Tier
- Server spins down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds (cold start)
- 750 hours/month free compute
- This is normal for portfolio sites

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domains supported
- Auto-deploy on every push to main

### Custom Domain (Optional)
- **Vercel**: Settings → Domains → Add your domain
- **Render**: Settings → Custom Domains → Add your domain

### Auto-Deploy
Both Vercel and Render automatically redeploy when you push to `main` branch.
