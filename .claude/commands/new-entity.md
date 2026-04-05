# Scaffold New Backend Entity

Scaffold a complete new resource for the portfolio backend + frontend integration.

The user will provide the entity name (e.g., `Award`, `Publication`, `Volunteer`).

## What to create

Given entity name `$ARGUMENTS` (PascalCase, e.g. `Award`):

### 1. Backend — read existing similar entities first

Before writing any code, read an existing entity for reference:
- Entity: `backend/src/main/java/com/portfolio/entity/Certification.java`
- Repository: `backend/src/main/java/com/portfolio/repository/CertificationRepository.java`
- Service: `backend/src/main/java/com/portfolio/service/CertificationService.java`
- Controller: `backend/src/main/java/com/portfolio/controller/CertificationController.java`
- Request DTO: look in `backend/src/main/java/com/portfolio/dto/request/`

Then create for the new entity:

**Entity** (`backend/src/main/java/com/portfolio/entity/{Name}.java`):
- `@Entity @Table(name = "{names}")` (plural snake_case)
- UUID primary key with `gen_random_uuid()`
- `created_at` / `updated_at` with `@CreationTimestamp` / `@UpdateTimestamp`
- Lombok `@Data @Builder @NoArgsConstructor @AllArgsConstructor`

**Repository** (`backend/src/main/java/com/portfolio/repository/{Name}Repository.java`):
- Extends `JpaRepository<{Name}, UUID>`
- Add `findAllByOrderByCreatedAtDesc()` or relevant sort method

**Service** (`backend/src/main/java/com/portfolio/service/{Name}Service.java`):
- Full CRUD: `findAll()`, `findById()`, `create()`, `update()`, `delete()`
- Use `ResourceNotFoundException` for not-found cases

**Controller** (`backend/src/main/java/com/portfolio/controller/{Name}Controller.java`):
- `@RestController @RequestMapping("/api/{names}")`
- Public `GET /api/{names}` endpoint
- Admin CRUD at `GET/POST/PUT/DELETE /api/admin/{names}[/{id}]`
- Follow `@PreAuthorize("hasRole('ADMIN')")` pattern for admin endpoints

**Request DTO** (`backend/src/main/java/com/portfolio/dto/request/{Name}Request.java`):
- Jakarta validation annotations (`@NotBlank`, `@Size`, etc.)
- Lombok `@Data`

### 2. Database — add to schema.sql

Append to `backend/src/main/resources/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS {names} (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- fields here
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Security config — register public endpoint

Read `backend/src/main/java/com/portfolio/config/SecurityConfig.java` and add:
```
"/api/{names}",
```
to the public GET endpoints list.

### 4. Frontend — TypeScript type + API client

Read `frontend/src/types/index.ts` and add the new interface.

Read `frontend/src/lib/api.ts` and add:
- `get{Names}()` public method
- Admin CRUD methods in the admin section

Read `frontend/src/lib/static-data.ts` and add fallback array.

### 5. Verify

After scaffolding, remind the user to:
- Run `./gradlew build` to check for compilation errors
- Test the endpoints: `GET /api/{names}`, `POST /api/admin/{names}`
- Add a frontend section component if needed (`/new-section` command)
