# Portfolio Application

## Project Overview

Personal portfolio web application with admin CMS dashboard for **Ly Van Quang Trung** - Software Engineer.

- **Frontend:** Next.js 14 (App Router) + shadcn/ui + Tailwind CSS + Framer Motion
- **Backend:** Java Spring Boot 3.4.5 + Spring Security + JWT
- **Database:** PostgreSQL on Neon (cloud, Singapore region)
- **Deployment:** Vercel (frontend) + Fly.io (backend)
- **CI/CD:** GitHub Actions
- **Package Managers:** pnpm (frontend), Gradle (backend)

## Live URLs

| Environment | URL |
|-------------|-----|
| **Portfolio (Production)** | https://frontend-two-tan-77.vercel.app |
| **Admin CMS** | https://frontend-two-tan-77.vercel.app/admin/login |
| **Backend API** | https://portfolio-backend-trung.fly.dev/api/ |
| **GitHub Repo** | https://github.com/quangtrungSA/My-Portfolio |

## Project Structure

```
My-Portfolio/
├── .github/workflows/    GitHub Actions CI/CD
│   └── ci.yml            Test + Build + Docker check
├── backend/              Spring Boot API (port 8080)
│   ├── Dockerfile        Multi-stage Docker build
│   ├── fly.toml          Fly.io deployment config
│   ├── build.gradle      Gradle dependencies
│   └── src/              Java source code
├── frontend/             Next.js app (port 3000)
│   ├── Dockerfile        Multi-stage Docker build
│   ├── next.config.mjs   API proxy + standalone config
│   └── src/              TypeScript source code
├── docs/                 Project documentation (8 files)
├── docker-compose.yml    Local Docker orchestration
├── render.yaml           Render deployment config (alternative)
└── CLAUDE.md             This file
```

## How to Run

### Local Development

```bash
# Backend (requires Java 21 + env vars)
cd backend
export NEON_JDBC_URL=jdbc:postgresql://...  # or create backend/.env
./gradlew bootRun

# Frontend
cd frontend
pnpm dev
```

### Docker (Local)

```bash
# Create .env at root with NEON_JDBC_URL, NEON_USERNAME, NEON_PASSWORD
docker compose up --build
```

### Admin Credentials
- Username: `admin`
- Password: `changeme`

## Architecture

```
Browser → Vercel (Next.js) ──API proxy──→ Fly.io (Spring Boot) ──JDBC──→ Neon (PostgreSQL)
              :3000                            :8080                    Singapore region
```

- API proxy via `next.config.mjs` rewrites (`/api/*` → backend) eliminates CORS
- JWT stored in httpOnly cookie (not localStorage)
- Server Components for public pages, Client Components for admin
- `spring.jpa.hibernate.ddl-auto: none` - schema managed by `schema.sql`
- All schema changes use `IF NOT EXISTS` for non-destructive migrations

## Database

PostgreSQL hosted on Neon (Singapore). Connection via env vars `NEON_JDBC_URL`, `NEON_USERNAME`, `NEON_PASSWORD`.

### Tables (13 total)

| Group | Tables |
|-------|--------|
| **Core (v1.0)** | users, profiles, skills, projects, experiences, education, blog_posts, contacts |
| **Extended (v1.1)** | certifications, testimonials, project_images, tags, blog_post_tags, site_settings |

## Backend (Spring Boot)

### Tech Stack
- Java 21 + Spring Boot 3.4.5
- Spring Security + JWT (jjwt 0.12.6)
- Spring Data JPA + Hibernate 6.6
- PostgreSQL driver + HikariCP
- Hypersistence Utils (JSONB/array types)
- Lombok + Jakarta Validation
- Spring Mail (optional)

### Source Structure
```
backend/src/main/java/com/portfolio/
├── PortfolioApplication.java
├── config/          SecurityConfig, DataSeeder
├── security/        JwtTokenProvider, JwtAuthFilter, UserDetailsService
├── controller/      13 REST controllers
├── service/         13 service classes
├── repository/      12 JPA repositories
├── entity/          12 entity classes
├── dto/
│   ├── request/     11 request DTOs
│   └── response/    ApiResponse, AuthResponse
└── exception/       GlobalExceptionHandler, ResourceNotFoundException
```

### API Endpoints

| Type | Count | Pattern |
|------|-------|---------|
| Public GET | 12 | `/api/{resource}` |
| Public POST | 2 | `/api/contacts`, `/api/auth/login` |
| Admin CRUD | 30+ | `/api/admin/{resource}` |

Full reference: [docs/API_Endpoints.md](docs/API_Endpoints.md)

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEON_JDBC_URL` | Yes | localhost | PostgreSQL JDBC URL |
| `NEON_USERNAME` | Yes | postgres | Database username |
| `NEON_PASSWORD` | Yes | postgres | Database password |
| `JWT_SECRET` | Production | (fallback) | JWT signing key (64+ chars) |
| `MAIL_HOST` | No | smtp.gmail.com | SMTP host |
| `MAIL_USERNAME` | No | (empty) | SMTP username |
| `MAIL_PASSWORD` | No | (empty) | SMTP password |

## Frontend (Next.js)

### Tech Stack
- Next.js 14.2 (App Router)
- React 18 + TypeScript 5
- shadcn/ui + Tailwind CSS 3.4
- Framer Motion (via `motion/react`)
- Lucide React icons
- react-hook-form + zod
- @tanstack/react-table
- next-themes (dark/light mode)
- react-markdown + rehype-highlight
- date-fns, sonner, recharts

### Source Structure
```
frontend/src/
├── app/
│   ├── page.tsx              Home page (10 sections)
│   ├── layout.tsx            Root layout + ThemeProvider
│   ├── blog/                 Blog pages
│   └── admin/                Admin CMS (12 pages)
│       ├── login/
│       ├── skills/
│       ├── projects/
│       ├── experience/
│       ├── education/
│       ├── certifications/
│       ├── testimonials/
│       ├── blog/
│       ├── contacts/
│       └── profile/
├── components/
│   ├── sections/             10 public sections
│   ├── layout/               Header, Footer, ThemeToggle
│   ├── shared/               SectionHeading
│   └── ui/                   shadcn/ui components (~40)
├── lib/                      API client, utils, constants
├── hooks/                    useAuth, useMobile
└── types/                    TypeScript interfaces
```

### Public Sections (Homepage)
Hero → About → Skills → Projects → Experience → Education → Certifications → Testimonials → Blog → Contact

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_URL` | Production | http://localhost:8080 | Backend URL for API proxy |
| `DOCKER` | Docker only | (unset) | Set `true` for standalone output |

## Deployment

| Service | Platform | Region | Config |
|---------|----------|--------|--------|
| Frontend | **Vercel** | Edge (global) | Auto-deploy from `main` |
| Backend | **Fly.io** | Singapore (`sin`) | `backend/fly.toml` |
| Database | **Neon** | Singapore | Cloud PostgreSQL |

### Auto-Deploy
Push to `main` → GitHub Actions CI runs → Vercel auto-deploys frontend.
Backend: `cd backend && fly deploy`

Full guide: [docs/Deployment_Guide.md](docs/Deployment_Guide.md)

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` runs on every push/PR to `main`:

1. **test-backend** - Java 21, Gradle build + test
2. **test-frontend** - Node 22, pnpm install + build
3. **docker-build** - Build both Docker images (after tests pass)

## Documentation

| Document | Description |
|----------|-------------|
| [docs/API_Endpoints.md](docs/API_Endpoints.md) | Complete REST API reference (public + admin endpoints) |
| [docs/Portfolio_DB_Requirements.md](docs/Portfolio_DB_Requirements.md) | Database requirements analysis - new tables & schema updates |
| [docs/License_Audit.md](docs/License_Audit.md) | Full dependency license audit (48 deps, all open-source) |
| [docs/PAID_RESOURCES.txt](docs/PAID_RESOURCES.txt) | Resources with free tier limits & paid alternatives |
| [docs/Certifications_Icons.md](docs/Certifications_Icons.md) | Certification icon/badge reference (Oracle, LPI) |
| [docs/Experience_Icons.md](docs/Experience_Icons.md) | Company logo/icon reference (FPT, Hybrid, Freelance) |
| [docs/Security_Push_Checklist.md](docs/Security_Push_Checklist.md) | **MUST READ** - Security checklist before pushing code |
| [docs/Deployment_Guide.md](docs/Deployment_Guide.md) | Step-by-step deploy guide (Vercel + Render/Fly.io) |

## Dependencies

All dependencies are **open-source** under permissive licenses (MIT, Apache-2.0, ISC, BSD-2-Clause). No proprietary libraries. See [docs/License_Audit.md](docs/License_Audit.md) for full audit.

## npm Registry

Frontend npm registry is the default public registry. Backend uses `mavenCentral()`. The system npm config points to an internal registry (`artifacts.mgm-tp.com`) which is unreachable - use `npm_config_registry=https://registry.npmjs.org` when installing packages globally.
