# Portfolio API Endpoints

**Base URL:** `http://localhost:8080`

## Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Public | Clears JWT cookie |
| GET | `/api/auth/me` | Admin | Current user info |

## Public Endpoints (GET)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profiles` | Get profile(s) |
| GET | `/api/skills` | List skills (optional `?category=`) |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/featured` | Featured projects only |
| GET | `/api/experiences` | List experiences |
| GET | `/api/education` | List education |
| GET | `/api/blog-posts` | Published blog posts |
| GET | `/api/blog-posts/{slug}` | Single post by slug |
| GET | `/api/certifications` | List certifications |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/testimonials/featured` | Featured testimonials |
| POST | `/api/contacts` | Submit contact form |

## Admin Endpoints (Require JWT)

All admin endpoints are prefixed with `/api/admin/` and require `ROLE_ADMIN`.

| Method | Path | Description |
|--------|------|-------------|
| PUT | `/api/admin/profiles/{id}` | Update profile |
| POST/PUT/DELETE | `/api/admin/skills[/{id}]` | Skills CRUD |
| POST/PUT/DELETE | `/api/admin/projects[/{id}]` | Projects CRUD |
| POST/PUT/DELETE | `/api/admin/experiences[/{id}]` | Experiences CRUD |
| POST/PUT/DELETE | `/api/admin/education[/{id}]` | Education CRUD |
| GET/POST/PUT/DELETE | `/api/admin/blog-posts[/{id}]` | Blog posts CRUD (GET = all incl. drafts) |
| GET/PUT/DELETE | `/api/admin/contacts[/{id}]` | Contacts management |
| GET | `/api/admin/contacts/unread-count` | Unread contacts count |
| PUT | `/api/admin/contacts/{id}/read` | Toggle read status |
| POST/PUT/DELETE | `/api/admin/certifications[/{id}]` | Certifications CRUD |
| POST/PUT/DELETE | `/api/admin/testimonials[/{id}]` | Testimonials CRUD |
| POST/PUT/DELETE | `/api/admin/project-images[/{id}]` | Project images CRUD |
| GET/PUT | `/api/admin/settings[/{key}]` | Site settings management |
| GET/POST/DELETE | `/api/admin/tags[/{id}]` | Tags CRUD |
