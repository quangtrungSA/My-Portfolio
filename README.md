# My Portfolio

A modern, full-stack personal portfolio web application with an admin CMS dashboard for **Ly Van Quang Trung** — Software Engineer.

**Live:** [frontend-two-tan-77.vercel.app](https://frontend-two-tan-77.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, shadcn/ui, Tailwind CSS, Framer Motion, TypeScript |
| **Backend** | Java 21, Spring Boot 3.4, Spring Security, JWT |
| **Database** | PostgreSQL 17 (Neon cloud, Singapore) |
| **Deployment** | Vercel (frontend) + Oracle Cloud Always Free VM (backend) |
| **CI/CD** | GitHub Actions |

## Features

**Public Portfolio**
- Hero section with animated gradient background
- About, Skills (categorized), Projects, Experience (timeline), Education
- Certifications (Oracle + LPI), Testimonials, Blog, Contact form
- Dark/Light mode toggle, fully responsive (mobile-first)
- **Static fallback data** — portfolio renders fully even when backend is offline

**Admin CMS** (`/admin`)
- JWT authentication (httpOnly cookie)
- CRUD for all portfolio sections
- Blog post editor with Markdown support
- Contact messages management with read/unread status

## Quick Start

### Prerequisites
- Java 21+
- Node.js 22+ & pnpm
- PostgreSQL (or Neon account)

### Backend
```bash
cd backend
export NEON_JDBC_URL=jdbc:postgresql://...
export NEON_USERNAME=...
export NEON_PASSWORD=...
./gradlew bootRun
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev        # http://localhost:3000
```

### Docker (full stack)
```bash
# Create .env with NEON_JDBC_URL, NEON_USERNAME, NEON_PASSWORD
docker compose up --build
```

## Architecture

```
Browser → Vercel (Next.js) ──middleware proxy──▶ Oracle Cloud VM (Spring Boot) ──JDBC──▶ Neon (PostgreSQL)
              :3000                                        :8080                        Singapore
```

- `middleware.ts` handles API routing: `/api/auth/*` → Next.js routes, `/api/*` → backend proxy
- JWT stored in httpOnly cookie (never localStorage)
- `src/lib/static-data.ts` provides full fallback data when API is unreachable

## Deployment

| Service | Platform | Region |
|---------|----------|--------|
| Frontend | Vercel | Edge (global) |
| Backend | Oracle Cloud Always Free VM (ARM) | ap-singapore-1 |
| Database | Neon | Singapore |

Auto-deploy: push to `main` → GitHub Actions CI → Vercel auto-deploys frontend + SSH deploy to Oracle Cloud VM.

See [docs/Deployment_Guide.md](docs/Deployment_Guide.md) for full setup instructions.

## Project Structure

```
.
├── backend/                 Spring Boot API (port 8080)
│   ├── src/main/java/       Controllers, services, entities, DTOs
│   ├── src/main/resources/  application.yml + schema.sql
│   └── Dockerfile           Multi-stage Docker build
├── frontend/                Next.js app (port 3000)
│   ├── src/app/             Pages: / (home), /blog, /admin/*
│   ├── src/components/      Sections, layout, shadcn/ui components
│   ├── src/lib/             API client, static-data, utils
│   └── next.config.mjs      Standalone output config
├── .github/workflows/ci.yml CI: test → build → docker check → deploy
├── docs/                    Documentation (8 files)
├── scripts/deploy-oracle.sh Oracle Cloud VM deploy script
└── docker-compose.yml       Local Docker orchestration
```

## Database

Tables: `users` `profiles` `skills` `skill_categories` `projects` `project_images` `experiences` `experience_phases` `experience_roles` `education` `blog_posts` `contacts` `certifications` `testimonials` `tags` `site_settings`

Schema managed by `backend/src/main/resources/schema.sql` — all `IF NOT EXISTS` (non-destructive migrations).

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Full project reference (architecture, env vars, structure) |
| [docs/API_Endpoints.md](docs/API_Endpoints.md) | Complete REST API reference |
| [docs/Deployment_Guide.md](docs/Deployment_Guide.md) | Step-by-step deploy guide (Vercel + Oracle Cloud) |
| [docs/Portfolio_DB_Requirements.md](docs/Portfolio_DB_Requirements.md) | Database schema & requirements |
| [docs/License_Audit.md](docs/License_Audit.md) | Dependency license audit (all open-source) |
| [docs/Security_Push_Checklist.md](docs/Security_Push_Checklist.md) | **MUST READ** before pushing code |

## Admin Credentials (local/dev)

- Username: `admin`
- Password: `changeme`

## License

All dependencies are open-source (MIT, Apache-2.0, ISC, BSD-2-Clause). See [docs/License_Audit.md](docs/License_Audit.md).
