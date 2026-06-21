# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@bopacorp/shared` — Shared Zod schemas and TypeScript types for the BOPADIGITAL platform. Consumed by three repos: `bopacorp-api`, `bopacorp-web`, `bopacorp-mobile`.

Stack: Zod 4 + TypeScript 6, ESM only, published to GitHub Packages.

## Commands

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Clean + rebuild | `rm -rf dist && npm run build` |
| Publish | `npm version patch && npm publish` |

## Architecture

Subpath exports — each domain module has its own import path:

```
@bopacorp/shared          → src/index.ts (re-exports all)
@bopacorp/shared/common   → src/common/index.ts
@bopacorp/shared/auth     → src/auth/index.ts
```

```
src/
├── index.ts              # Root barrel (export * from each module)
├── common/
│   ├── index.ts          # Barrel with explicit named exports
│   ├── primitives.ts     # UUID, email, pagination, timestamps
│   └── api-response.ts   # ApiSuccess, ApiPaginated, ApiError wrappers
└── auth/
    ├── index.ts          # Barrel
    ├── enums.ts          # z.enum() from SQL CHECK constraints
    ├── request.ts        # Request validation schemas
    └── response.ts       # Response type schemas
```

## How to Add a New Domain Module

Source of truth: SQL models at `../bopacorp-api/models/`. Each `.sql` file maps to one module in this package.

| SQL file | Shared module |
|----------|---------------|
| `01_auth_rbac.sql` | `src/auth/` (done) |
| `02_profiles.sql` | embedded in `src/auth/` (done) |
| `03_crm.sql` | `src/crm/` |
| `04_catalog.sql` | `src/catalog/` |
| `05_matrices.sql` | `src/matrices/` |
| `06_documents.sql` | `src/documents/` |
| `07_employability.sql` | `src/employability/` |
| `08_reports_notifications.sql` | `src/notifications/` |

### Step-by-step

**1. Create folder and files:**

```
src/[module]/
├── index.ts      # Barrel
├── enums.ts      # From SQL CHECK constraints (skip if none)
├── request.ts    # Request schemas
└── response.ts   # Response schemas
```

**2. Extract enums from SQL CHECK constraints:**

```sql
-- SQL
CHECK (status IN ('draft', 'sent', 'approved', 'rejected'))
```
```typescript
// enums.ts
export const ProposalStatusSchema = z.enum(['draft', 'sent', 'approved', 'rejected']);
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;
```

**3. Create request schemas — what clients SEND:**

Map SQL columns to Zod fields with these rules:

| SQL type | Zod schema |
|----------|------------|
| `UUID` | `UuidSchema` (from common) |
| `VARCHAR(N)` | `z.string().max(N)` |
| `TEXT` | `z.string()` |
| `INTEGER` | `z.number().int()` |
| `BOOLEAN` | `z.boolean()` |
| `NUMERIC(p,s)` | `z.number()` |
| `TIMESTAMPTZ` | `z.string().datetime()` |
| `JSONB` | `z.record(z.unknown())` or specific shape |
| `NOT NULL` | required (default) |
| nullable column | `.optional()` on Create, `.optional()` on Update |
| `CHECK (... IN (...))` | use enum from `enums.ts` |
| query params (GET) | use `z.coerce.number()` / `z.coerce.boolean()` |

Naming: `[Create|Update|List|Assign][Entity]RequestSchema`

Create = all required fields. Update = `.partial()` or manual optional fields. List = extend `PaginationQuerySchema`.

**4. Create response schemas — what API RETURNS:**

| Rule | How |
|------|-----|
| Include timestamps | `.merge(TimestampsSchema)` |
| Nullable DB columns | `.nullable()` (not `.optional()` — JSON key always present) |
| Related entities | inline `z.object()` with only display fields |
| List variant | slim version with fewer nested fields |
| Detail variant | extends base with full nested data |

Naming: `[Entity]ResponseSchema`, `[Entity]ListItemResponseSchema`, `[Entity]DetailResponseSchema`

**5. Write barrel in `src/[module]/index.ts`:**

Explicit named exports. Separate `export type` from value exports (required by `verbatimModuleSyntax`).

**6. Register the module (3 places):**

a. Add to `package.json` exports map:
```json
"./crm": {
  "types": "./dist/crm/index.d.ts",
  "import": "./dist/crm/index.js"
}
```

b. Add to `src/index.ts`:
```typescript
export * from './crm/index.js';
```

c. Update this table in CLAUDE.md (mark as done).

**7. Build and verify:**
```bash
rm -rf dist && npm run build
```

## Security Rules — Fields to NEVER Expose

When translating SQL tables to shared schemas, always exclude:

- `password_hash` — internal credential
- `failed_login_attempts` — reveals brute-force state
- `locked_until` — reveals lockout window
- `deleted_at` — soft-delete internal (deleted records simply absent from responses)
- raw token values — only in login/refresh response, never in listing endpoints
- `ip_address`, `user_agent` on log tables — internal forensics only

General rule: if a column exists for internal security/auditing, it stays in backend only.

## Code Rules

- All imports use `.js` extension (nodenext)
- `import type` for type-only imports (verbatimModuleSyntax)
- Reuse primitives from `common/primitives.ts` — don't redefine UUID, email, pagination
- Barrel files use explicit named exports, not `export *`
- No comments in source files
- No emojis in source files
- All identifiers, schema names, file names, and internal code in English
- User-facing validation messages in Spanish (the platform UI is 100% Spanish)
- Recursive types (like tree structures) use `z.lazy()` + explicit interface
