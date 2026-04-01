# Portfolio Application

## Project Overview

Personal portfolio web application with admin CMS dashboard.

- **Frontend:** Next.js 14 (App Router) + shadcn/ui + Tailwind CSS + Framer Motion
- **Backend:** Java Spring Boot 3.4.5 + Spring Security + JWT
- **Database:** PostgreSQL on Neon (cloud)
- **Package Managers:** pnpm (frontend), Gradle (backend)

## Project Structure

```
/Users/tvqly/demo/
├── backend/          Spring Boot API (port 8080)
├── frontend/         Next.js app (port 3000)
└── docs/             Project documentation
```

## How to Run

### Backend
```bash
cd backend
./gradlew bootRun -Dgradle.user.home=/tmp/gradle-temp
```

### Frontend
```bash
cd frontend
pnpm dev
```

### URLs
- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin/login
- API: http://localhost:8080/api/

### Admin Credentials
- Username: `admin`
- Password: `changeme`

## Database

PostgreSQL hosted on Neon. Connection configured in `backend/src/main/resources/application.yml`. Schema auto-runs from `schema.sql` on startup.

### Tables (13 total)
**Core:** users, profiles, skills, projects, experiences, education, blog_posts, contacts
**v1.1:** certifications, testimonials, project_images, tags, blog_post_tags, site_settings

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

## Key Architecture Decisions

- API proxy via `next.config.js` rewrites (`/api/*` → `localhost:8080`) eliminates CORS
- JWT stored in httpOnly cookie (not localStorage)
- Server Components for public pages, Client Components for admin
- `spring.jpa.hibernate.ddl-auto: none` - schema managed by `schema.sql`
- All new columns use `IF NOT EXISTS` for non-destructive migrations

## Dependencies

All dependencies are **open-source** under permissive licenses (MIT, Apache-2.0, ISC, BSD-2-Clause). No proprietary libraries. See [docs/License_Audit.md](docs/License_Audit.md) for full audit.

## npm Registry

Frontend npm registry is the default public registry. Backend uses `mavenCentral()`. The system npm config points to an internal registry (`artifacts.mgm-tp.com`) which is unreachable - use `npm_config_registry=https://registry.npmjs.org` when installing packages globally.
