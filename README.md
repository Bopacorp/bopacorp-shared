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
```

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
