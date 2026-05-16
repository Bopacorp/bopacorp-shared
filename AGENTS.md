# AGENTS.md - @bopacorp/shared

## What This Package Does

Single source of truth for API contracts between `bopacorp-api`, `bopacorp-web`, and `bopacorp-mobile`. Defines Zod schemas that provide both runtime validation and TypeScript types from one definition.

```
bopacorp-api        →  validates requests with schemas
bopacorp-web        →  types API calls with inferred types
bopacorp-mobile     →  types API calls with inferred types
                 ↑
         @bopacorp/shared
```

## Three Layers of Types

```
DB Layer (backend only)  →  API Layer (this package)  →  UI Layer (each frontend)
Prisma/internal              request + response            selection, loading, UI state
```

This package only defines the **API layer**. Never expose DB internals. Never define UI state.

| Belongs here | Does NOT belong here |
|---|---|
| `LoginRequestSchema` | Prisma model types |
| `UserResponseSchema` | `password_hash`, `deleted_at` |
| `PaginationQuerySchema` | `isSelected`, `isLoading` |
| Enums from SQL CHECK constraints | Database connection config |

## How Types Flow

```typescript
// 1. BACKEND — validates input, shapes output
import { LoginRequestSchema, type LoginResponse } from '@bopacorp/shared/auth';

const body = LoginRequestSchema.parse(req.body);  // runtime validation
const response: LoginResponse = toLoginResponse(dbUser);  // DB → API shape

// 2. FRONTEND — types API calls
import type { LoginRequest, LoginResponse } from '@bopacorp/shared/auth';

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};
```

## Package Structure

```
src/
├── index.ts                  # Re-exports everything
├── common/                   # Reusable across all modules
│   ├── index.ts
│   ├── primitives.ts         # UUID, email, pagination, timestamps
│   └── api-response.ts       # ApiSuccess, ApiPaginated, ApiError
└── auth/                     # Auth domain module
    ├── index.ts
    ├── enums.ts              # PermissionType, TokenType, etc.
    ├── request.ts            # What clients send
    └── response.ts           # What API returns
```

Each domain module follows the same 4-file pattern: `index.ts`, `enums.ts`, `request.ts`, `response.ts`.

## Import Paths

Two ways to import — both work:

```typescript
// Root — imports everything, simpler
import { LoginRequestSchema, type UserResponse } from '@bopacorp/shared';

// Subpath — explicit, tree-shakeable
import { LoginRequestSchema } from '@bopacorp/shared/auth';
import { PaginationQuerySchema } from '@bopacorp/shared/common';
```

## Schema Naming Convention

Pattern: `[Action][Entity][Direction]Schema`

### Requests (what clients send)

| Pattern | Example | Used for |
|---------|---------|----------|
| `Create[Entity]RequestSchema` | `CreateUserRequestSchema` | POST body |
| `Update[Entity]RequestSchema` | `UpdateRoleRequestSchema` | PATCH body |
| `List[Entity]QuerySchema` | `ListUsersQuerySchema` | GET query params |
| `Assign[Entity]RequestSchema` | `AssignUserRolesRequestSchema` | PUT relationship |
| `[Action]RequestSchema` | `LoginRequestSchema` | Specific actions |
| `IdParamSchema` | `IdParamSchema` | Route param `:id` |

### Responses (what API returns)

| Pattern | Example | Used for |
|---------|---------|----------|
| `[Entity]ResponseSchema` | `UserResponseSchema` | Full single entity |
| `[Entity]ListItemResponseSchema` | `UserListItemResponseSchema` | Slimmed for lists |
| `[Entity]DetailResponseSchema` | `RoleDetailResponseSchema` | Extended with nested data |
| `MessageResponseSchema` | `MessageResponseSchema` | Generic `{ message }` |

### Types

Every schema exports its inferred type on the next line:

```typescript
export const CreateUserRequestSchema = z.object({ ... });
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
```

Never define types separately from schemas. Always infer with `z.infer`.

## SQL to Zod Translation Rules

Source of truth for DB schema lives at `../bopacorp-api/models/*.sql`.

### Column type mapping

| SQL | Zod | Notes |
|-----|-----|-------|
| `UUID` | `UuidSchema` | Import from `common/primitives` |
| `VARCHAR(N)` | `z.string().max(N)` | Add `.min(1)` if `NOT NULL` in request |
| `TEXT` | `z.string()` | |
| `INTEGER` | `z.number().int()` | |
| `BOOLEAN` | `z.boolean()` | |
| `NUMERIC(p,s)` | `z.number()` | |
| `TIMESTAMPTZ` | `z.string().datetime()` | ISO string, not Date object |
| `JSONB` | specific `z.object()` or `z.record(z.unknown())` | |

### Nullability rules

| Context | SQL nullable column | Zod |
|---------|-------------------|-----|
| **Create request** | nullable → `.optional()` | not null → required |
| **Update request** | all fields `.optional()` | (PATCH semantics) |
| **Response** | nullable → `.nullable()` | always present in JSON, value may be `null` |
| **Query params** | always `.optional()` | filters are optional |

Key distinction: **request** uses `.optional()` (field can be omitted), **response** uses `.nullable()` (field always present, value can be `null`).

### CHECK constraints become enums

```sql
CHECK (type IN ('crud', 'action', 'report', 'view', 'approval'))
```

```typescript
export const PermissionTypeSchema = z.enum(['crud', 'action', 'report', 'view', 'approval']);
export type PermissionType = z.infer<typeof PermissionTypeSchema>;
```

### Query params use coercion

Express delivers query params as strings. Use `z.coerce` for numeric/boolean params:

```typescript
export const ListUsersQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),  // "true" → true
});
```

### Relationships in responses

Don't nest full entities. Include only display-relevant fields:

```typescript
// Full UserResponseSchema has this for roles:
roles: z.array(z.object({
  id: UuidSchema,
  name: z.string(),
  slug: z.string(),
}))

// List variant slims it further:
roles: z.array(z.string())  // just slugs
```

### Recursive/tree structures

Use `z.lazy()` with explicit interface:

```typescript
interface ModuleTree extends z.infer<typeof ModuleResponseSchema> {
  children: ModuleTree[];
}

export const ModuleTreeResponseSchema: z.ZodType<ModuleTree> = ModuleResponseSchema.extend({
  children: z.lazy(() => z.array(ModuleTreeResponseSchema)),
});
```

## Adding a New Module — Checklist

Example: adding `crm` from `03_crm.sql`.

- [ ] Read SQL file, identify tables, columns, CHECK constraints, relationships
- [ ] Create `src/crm/enums.ts` — one `z.enum()` per CHECK constraint
- [ ] Create `src/crm/request.ts` — Create/Update/List schemas per entity
- [ ] Create `src/crm/response.ts` — Response/ListItem/Detail schemas per entity
- [ ] Create `src/crm/index.ts` — explicit barrel with `export` and `export type` separated
- [ ] Add to `package.json` exports map:
  ```json
  "./crm": {
    "types": "./dist/crm/index.d.ts",
    "import": "./dist/crm/index.js"
  }
  ```
- [ ] Add to `src/index.ts`:
  ```typescript
  export * from './crm/index.js';
  ```
- [ ] `rm -rf dist && npm run build` — zero errors
- [ ] `grep -r "password_hash\|deleted_at" src/` — zero results

## Fields That NEVER Appear in This Package

| Field | Table | Why excluded |
|-------|-------|-------------|
| `password_hash` | auth.users | Internal credential |
| `failed_login_attempts` | auth.users | Reveals brute-force state |
| `locked_until` | auth.users | Reveals lockout window |
| `deleted_at` | any table | Soft-delete internal |
| `token` (raw) | auth.auth_tokens | Only in login/refresh flow |
| `ip_address` | log tables | Internal forensics |
| `user_agent` | log tables | Internal forensics |
| `old_data` / `new_data` | audit_logs | Internal audit trail |

General rule: if it exists for security, auditing, or soft-deletion — it stays in backend.

## Code Rules

- **English only** — all names, messages, everything
- **No comments** — code must be self-explanatory
- **No emojis** in source files
- **`.js` extension** on all relative imports (`'./enums.js'` not `'./enums'`)
- **`import type`** for type-only imports (enforced by `verbatimModuleSyntax`)
- **Reuse primitives** from `common/` — don't redefine UUID, email, pagination
- **Explicit barrel exports** — no `export *` in module barrels, only in root `index.ts`

## Versioning

Semver. Bump rules:

| Change | Version bump |
|--------|-------------|
| New schemas added | `patch` (0.1.0 → 0.1.1) |
| Schema fields added (non-breaking) | `patch` |
| Schema fields removed or renamed | `minor` during 0.x, `major` after 1.0 |
| New module added | `minor` (0.1.x → 0.2.0) |

```bash
npm version patch   # or minor
npm publish
```

Then in each consumer repo:

```bash
npm update @bopacorp/shared
```
