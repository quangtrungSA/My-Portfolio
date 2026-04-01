# My Portfolio

A modern, full-stack personal portfolio web application with an admin CMS dashboard.

**Live:** [frontend-two-tan-77.vercel.app](https://frontend-two-tan-77.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, shadcn/ui, Tailwind CSS, Framer Motion, TypeScript |
| **Backend** | Java 21, Spring Boot 3.4, Spring Security, JWT |
| **Database** | PostgreSQL 17 (Neon cloud) |
| **Deployment** | Vercel (frontend) + Fly.io (backend) |
| **CI/CD** | GitHub Actions |

## Features

**Public Portfolio**
- Hero section with animated gradient background
- About, Skills (categorized), Projects, Experience (timeline), Education
- 8 International Certifications (Oracle + LPI)
- Testimonials, Blog, Contact form
- Dark/Light mode toggle
- Fully responsive (mobile-first)

**Admin CMS** (`/admin`)
- JWT authentication
- CRUD for all portfolio sections
- Blog post editor
- Contact messages management
- Dashboard with stats

## Quick Start

### Prerequisites
- Java 21+
- Node.js 22+ & pnpm
- PostgreSQL (or Neon account)

### Backend
```bash
cd backend
# Set env vars (or create .env file)
export NEON_JDBC_URL=jdbc:postgresql://...
export NEON_USERNAME=...
export NEON_PASSWORD=...

./gradlew bootRun
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Docker
```bash
# Create .env with database credentials
docker compose up --build
```

Open http://localhost:3000

## Project Structure

```
.
├── backend/                 Spring Boot API
│   ├── src/main/java/       Java source (controllers, services, entities)
│   ├── src/main/resources/  Config + SQL schema
│   ├── Dockerfile           Multi-stage Docker build
│   └── fly.toml             Fly.io config
├── frontend/                Next.js app
│   ├── src/app/             Pages (public + admin)
│   ├── src/components/      UI components (sections, layout, shadcn)
│   ├── src/lib/             API client, utils
│   ├── Dockerfile           Multi-stage Docker build
│   └── next.config.mjs      API proxy config
├── docs/                    Documentation (8 files)
├── .github/workflows/       CI/CD pipeline
├── docker-compose.yml       Local orchestration
└── CLAUDE.md                Detailed project reference
```

## Database

13 tables on Neon PostgreSQL:

`users` `profiles` `skills` `projects` `experiences` `education` `blog_posts` `contacts` `certifications` `testimonials` `project_images` `tags` `site_settings`

Schema auto-creates on startup via `schema.sql`.

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [frontend-two-tan-77.vercel.app](https://frontend-two-tan-77.vercel.app) |
| Backend | Fly.io | [portfolio-backend-trung.fly.dev](https://portfolio-backend-trung.fly.dev) |
| Database | Neon | Singapore region |

See [docs/Deployment_Guide.md](docs/Deployment_Guide.md) for full instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Detailed project reference (architecture, structure, env vars) |
| [docs/API_Endpoints.md](docs/API_Endpoints.md) | REST API reference |
| [docs/Deployment_Guide.md](docs/Deployment_Guide.md) | Deploy guide (Vercel + Fly.io + Docker) |
| [docs/Portfolio_DB_Requirements.md](docs/Portfolio_DB_Requirements.md) | Database schema analysis |
| [docs/License_Audit.md](docs/License_Audit.md) | Dependency license audit |
| [docs/Security_Push_Checklist.md](docs/Security_Push_Checklist.md) | Security checklist before pushing |

## License

All dependencies are open-source (MIT, Apache-2.0, ISC, BSD-2-Clause). See [docs/License_Audit.md](docs/License_Audit.md).
