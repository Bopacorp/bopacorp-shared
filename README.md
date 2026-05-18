# @bopacorp/shared

Shared Zod schemas and TypeScript types for the BOPADIGITAL platform.

Used by:
- **bopacorp-api** — request validation and response typing
- **bopacorp-web** — CRM/CMS frontend types
- **bopacorp-mobile** — field app types

## Install

Add `.npmrc` to your project root:

```
@bopacorp:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set `NPM_TOKEN` env var with a GitHub PAT (scopes: `read:packages`).

Then:

```bash
npm install @bopacorp/shared
```

## Usage

```typescript
// Root import (all modules)
import { LoginRequestSchema } from '@bopacorp/shared';
import type { UserResponse } from '@bopacorp/shared';

// Subpath import (tree-shakeable, explicit)
import { LoginRequestSchema } from '@bopacorp/shared/auth';
import { PaginationQuerySchema } from '@bopacorp/shared/common';
import type { UserResponse } from '@bopacorp/shared/auth';
```

### Available subpaths

| Subpath | Contents |
|---------|----------|
| `@bopacorp/shared` | Everything (re-exports all modules) |
| `@bopacorp/shared/common` | Primitives, pagination, API response wrappers |
| `@bopacorp/shared/auth` | Auth, users, roles, permissions, modules |
| `@bopacorp/shared/core` | Profiles, advisor-supervisor assignments |
| `@bopacorp/shared/catalog` | Catalog items, categories, lookup tables, CMS, contacts |
| `@bopacorp/shared/employability` | Candidates, job vacancies, applications, resumes |

## Development

```bash
npm install
npm run build
```

## Publish

```bash
npm version patch
npm publish
```
