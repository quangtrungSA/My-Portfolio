# License & Dependency Audit

**Project:** Portfolio Application
**Audit Date:** April 2026
**Status:** All dependencies are open-source and freely available for commercial use.

---

## 1. Audit Summary

| Category | Total Dependencies | Open-Source | Proprietary | Paid Required |
|:-:|:-:|:-:|:-:|:-:|
| Backend (Java) | 12 direct | 12 | 0 | 0 |
| Frontend (Node.js) | 28 production + 8 dev | 36 | 0 | 0 |
| Infrastructure | 3 services | 2 fully free | 0 | 1 (free tier with limits) |
| Runtime | 4 tools | 4 | 0 | 0 |

**Conclusion:** This project uses **zero proprietary dependencies**. All libraries are released under permissive open-source licenses (MIT, Apache-2.0, ISC, BSD-2-Clause, EPL-2.0). One infrastructure service (Neon PostgreSQL) has a free tier with usage limits -- documented in `PAID_RESOURCES.txt`.

---

## 2. Backend Dependencies (Java / Spring Boot)

All sourced from Maven Central. No proprietary or paid libraries.

| Dependency | Version | License | Usage |
|------------|---------|---------|-------|
| Spring Boot Starter Web | 3.4.5 | Apache-2.0 | REST API, embedded Tomcat |
| Spring Boot Starter Data JPA | 3.4.5 | Apache-2.0 | ORM / Hibernate |
| Spring Boot Starter Security | 3.4.5 | Apache-2.0 | Authentication & authorization |
| Spring Boot Starter Validation | 3.4.5 | Apache-2.0 | Bean validation (Jakarta) |
| Spring Boot Starter Mail | 3.4.5 | Apache-2.0 | Email sending |
| Spring Boot DevTools | 3.4.5 | Apache-2.0 | Hot reload (dev only) |
| PostgreSQL JDBC Driver | (managed) | BSD-2-Clause | Database connectivity |
| jjwt-api / impl / jackson | 0.12.6 | Apache-2.0 | JWT token generation/validation |
| hypersistence-utils-hibernate-63 | 3.9.0 | Apache-2.0 | JSONB & PostgreSQL array support |
| Lombok | (managed) | MIT | Boilerplate reduction (compile-time only) |
| Spring Boot Starter Test | 3.4.5 | Apache-2.0 | Testing framework |
| Spring Security Test | (managed) | Apache-2.0 | Security testing utilities |

### Transitive Dependencies (key ones)

| Dependency | License | Notes |
|------------|---------|-------|
| Hibernate ORM 6.6.x | LGPL-2.1 | Bundled via Spring Data JPA; LGPL permits use without modification |
| Apache Tomcat 10.1.x | Apache-2.0 | Embedded web server |
| Jackson 2.18.x | Apache-2.0 | JSON serialization |
| SLF4J / Logback | MIT / EPL-1.0+LGPL-2.1 | Logging framework |
| HikariCP | Apache-2.0 | Connection pooling |
| SnakeYAML | Apache-2.0 | YAML config parsing |

---

## 3. Frontend Dependencies (Node.js / Next.js)

All sourced from npm public registry. No proprietary or paid packages.

### Production Dependencies

| Package | Version | License | Usage |
|---------|---------|---------|-------|
| next | 14.2.35 | MIT | React framework (App Router) |
| react | ^18 | MIT | UI library |
| react-dom | ^18 | MIT | React DOM renderer |
| motion | ^12.38.0 | MIT | Animations (Framer Motion) |
| lucide-react | ^1.7.0 | ISC | SVG icon library |
| zod | ^4.3.6 | MIT | Runtime schema validation |
| react-hook-form | ^7.72.0 | MIT | Form state management |
| @hookform/resolvers | ^5.2.2 | MIT | Zod integration for forms |
| @tanstack/react-table | ^8.21.3 | MIT | Headless data table |
| next-themes | ^0.4.6 | MIT | Dark/light mode |
| date-fns | ^4.1.0 | MIT | Date formatting |
| react-markdown | ^10.1.0 | MIT | Markdown rendering |
| remark-gfm | ^4.0.1 | MIT | GitHub Flavored Markdown |
| rehype-highlight | ^7.0.2 | MIT | Code syntax highlighting |
| sonner | ^2.0.7 | MIT | Toast notifications |
| shadcn | ^4.1.2 | MIT | UI component CLI |
| @base-ui/react | ^1.3.0 | MIT | Base UI primitives |
| tailwind-merge | ^3.5.0 | MIT | Tailwind class merging |
| class-variance-authority | ^0.7.1 | Apache-2.0 | Variant management |
| clsx | ^2.1.1 | MIT | Classname utility |
| cmdk | ^1.1.1 | MIT | Command palette |
| vaul | ^1.1.2 | MIT | Drawer component |
| tw-animate-css | ^1.4.0 | MIT | Tailwind animation utilities |
| embla-carousel-react | ^8.6.0 | MIT | Carousel component |
| react-day-picker | ^9.14.0 | MIT | Date picker |
| input-otp | ^1.4.2 | MIT | OTP input component |
| react-resizable-panels | ^4.8.0 | MIT | Resizable panel layout |
| recharts | 3.8.0 | MIT | Chart components |

### Dev Dependencies

| Package | Version | License | Usage |
|---------|---------|---------|-------|
| typescript | ^5 | Apache-2.0 | Type checking |
| tailwindcss | ^3.4.1 | MIT | Utility-first CSS |
| tailwindcss-animate | ^1.0.7 | MIT | Animation plugin |
| postcss | ^8 | MIT | CSS processing |
| eslint | ^8 | MIT | Linting |
| eslint-config-next | 14.2.35 | MIT | Next.js ESLint rules |
| @types/node | ^20 | MIT | Node.js type definitions |
| @types/react | ^18 | MIT | React type definitions |
| @types/react-dom | ^18 | MIT | React DOM type definitions |

---

## 4. Infrastructure & Services

| Service | License / Model | Cost | Notes |
|---------|----------------|------|-------|
| **PostgreSQL** | PostgreSQL License (OSI-approved, permissive) | Free | Open-source relational database |
| **Neon** (hosted PostgreSQL) | Proprietary SaaS | Free tier with limits | See `PAID_RESOURCES.txt` for details |
| **Node.js** | MIT | Free | JavaScript runtime |
| **Java (OpenJDK 21)** | GPL-2.0 with Classpath Exception | Free | Permits commercial use without restrictions |
| **Gradle** | Apache-2.0 | Free | Build tool |

---

## 5. Fonts & Assets

| Resource | License | Source |
|----------|---------|--------|
| Inter (Google Font) | SIL Open Font License 1.1 | Google Fonts (free) |
| Lucide Icons | ISC | lucide.dev (free, open-source) |

No proprietary fonts, images, or assets are used. All icons come from Lucide (open-source).

---

## 6. License Compatibility Matrix

All licenses used in this project are compatible with commercial and open-source use:

| License | Permits Commercial Use | Requires Attribution | Copyleft |
|---------|:---------------------:|:--------------------:|:--------:|
| **MIT** | Yes | Yes (in license file) | No |
| **Apache-2.0** | Yes | Yes (in NOTICE file) | No |
| **ISC** | Yes | Yes (minimal) | No |
| **BSD-2-Clause** | Yes | Yes (in license file) | No |
| **LGPL-2.1** (Hibernate) | Yes | Yes | Weak (library use OK) |
| **EPL-1.0** (Logback) | Yes | Yes | Weak (library use OK) |
| **SIL OFL 1.1** (Inter font) | Yes | Yes (in font files) | No |
| **PostgreSQL License** | Yes | Yes | No |

---

## 7. Verification Checklist

- [x] No proprietary libraries in backend (build.gradle)
- [x] No proprietary packages in frontend (package.json)
- [x] No paid APIs required for core functionality
- [x] No proprietary fonts or assets
- [x] No license-incompatible dependencies
- [x] All transitive dependencies checked for permissive licenses
- [x] Infrastructure free tier limits documented in PAID_RESOURCES.txt
- [x] No copyleft licenses that would require source disclosure (LGPL/EPL are weak copyleft, used only as libraries)
