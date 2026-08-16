# @bopacorp/shared

Shared Zod schemas and TypeScript types for the BOPADIGITAL API layer.

Used by:
- **bopacorp-api** — request validation and response typing
- **bopacorp-web** — Landing and CMS frontend types
- **bopacorp-crm** — CRM frontend types
- **bopacorp-mobile** — field app types

## Installation

Add `.npmrc` to your project root:

```
@bopacorp:registry=https://npm.pkg.github.com
```

Then:

```bash
npm install @bopacorp/shared
```

## Imports

```typescript
// Root import (all modules)
import { LoginRequestSchema } from '@bopacorp/shared';
import type { UserResponse } from '@bopacorp/shared';

// Subpath import (tree-shakeable, explicit)
import { LoginRequestSchema } from '@bopacorp/shared/auth';
import { PaginationQuerySchema } from '@bopacorp/shared/common';
import type { UserResponse } from '@bopacorp/shared/auth';
```

### Public entrypoints

| Subpath | Contents |
|---------|----------|
| `@bopacorp/shared` | Everything (re-exports all modules) |
| `@bopacorp/shared/common` | Primitives, pagination, API response wrappers |
| `@bopacorp/shared/auth` | Auth, users, roles, permissions, modules |
| `@bopacorp/shared/core` | Organizational and core contracts |
| `@bopacorp/shared/crm` | CRM contracts |
| `@bopacorp/shared/catalog` | Catalog contracts |
| `@bopacorp/shared/documents` | Document contracts |
| `@bopacorp/shared/document-uploads` | Document upload metadata contracts |
| `@bopacorp/shared/employability` | Employability contracts |
| `@bopacorp/shared/matrices` | Offer matrix contracts |
| `@bopacorp/shared/notifications` | Notification contracts |
| `@bopacorp/shared/reports` | Reporting contracts |
| `@bopacorp/shared/i18n` | Shared validation messages and translation keys |

## Contract scope

This package defines the API layer only: request schemas, response schemas, enums and inferred TypeScript types. Database internals, credentials, audit fields and UI state do not belong here.

## Development

```bash
npm ci
npm run check
npm run test:quality-gate
npm run build
```

## Release

```bash
npm version patch
npm publish --registry https://npm.pkg.github.com
```

The package publishes to GitHub Packages through the `publishConfig` registry in `package.json`. Configure authentication in the consuming environment and never commit tokens.
