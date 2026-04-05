# Database Migration

Add a schema change (new column, new table, new index) safely to the portfolio database.

The user will describe the change in `$ARGUMENTS` (e.g., "add bio_short column to profiles", "add sort_order to skills").

## How migrations work in this project

- **No migration framework** (no Flyway/Liquibase) — schema is managed by `schema.sql`
- Spring Boot runs `schema.sql` on every startup (`spring.sql.init.mode=always`)
- **All statements must use `IF NOT EXISTS`** or `ADD COLUMN IF NOT EXISTS` — never destructive

## Steps

### 1. Read current schema

Read `backend/src/main/resources/schema.sql` to understand the current state of the relevant table(s).

### 2. Write the migration statement

Choose the correct pattern:

**Add a column:**
```sql
ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {column_name} {type} {constraints};
```

**Create a new table:**
```sql
CREATE TABLE IF NOT EXISTS {table_name} (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- columns
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Add an index:**
```sql
CREATE INDEX IF NOT EXISTS idx_{table}_{column} ON {table}({column});
```

**Add a foreign key (as ALTER, safe):**
```sql
ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {fk_col} UUID REFERENCES {ref_table}(id) ON DELETE CASCADE;
```

### 3. Append to schema.sql

Add the new statement(s) at the bottom of `backend/src/main/resources/schema.sql` with a comment:

```sql
-- Migration: {describe the change} ({today's date})
ALTER TABLE ...
```

### 4. Update the Java entity

Read the relevant entity in `backend/src/main/java/com/portfolio/entity/` and add the new field:
- Use the correct JPA annotation (`@Column`, `@ManyToOne`, `@OneToMany`, etc.)
- Match the column name with `@Column(name = "column_name")` if it differs from field name

### 5. Update the DTO

Read the relevant request DTO in `backend/src/main/java/com/portfolio/dto/request/` and add the field with validation if needed.

### 6. Update the frontend TypeScript type

Read `frontend/src/types/index.ts` and add the new field to the relevant interface.

### 7. Verify

After making changes:
```bash
cd backend && ./gradlew build   # must compile cleanly
```

The schema change takes effect on next backend startup — no manual migration command needed.

## Important rules

- NEVER use `DROP COLUMN`, `DROP TABLE`, or `TRUNCATE` — always additive changes only
- NEVER remove `IF NOT EXISTS` guards — the schema runs on every startup
- For renaming: add new column + backfill + (much later) remove old column as separate steps
- Test locally with `./gradlew bootRun` before pushing
