# Fase 6 — Compatibilidad del package y consumidores

Fecha de evidencia: 2026-08-15

Package bajo prueba: `@bopacorp/shared@0.3.2`

## Comandos ejecutables

```bash
npm run test:artifact
npm run test:typelevel
npm run test:package
npm run test:compatibility
```

Los comandos no modifican API, Web, CRM ni Mobile. El consumer del tarball y el cache de npm se crean bajo `/tmp` y se eliminan al terminar.

## Resultado de exports y declaraciones

| Evidencia | Resultado |
|---|---|
| Root `@bopacorp/shared` | Pasa |
| Subpaths declarados | 12 de 12 pasan |
| Entrypoints totales | 13 de 13 resuelven a `dist/` |
| Runtime de schemas | `PaginationQuerySchema` y `LoginRequestSchema` pasan |
| Fixture type-level válido | Compila |
| Fixture type-level inválido | Rechaza `notAContractField` |
| Declarations requeridas en tarball | 26 archivos `.js`/`.d.ts` de entrypoints presentes |
| Consumer instalado desde tarball | Runtime y typecheck pasan |

Los subpaths probados son `common`, `auth`, `core`, `employability`, `crm`, `catalog`, `document-uploads`, `documents`, `matrices`, `notifications`, `reports` e `i18n`, además del root.

## Compatibilidad observada

| Consumer | Versión declarada | `package-lock.json` | `pnpm-lock.yaml` | Estado |
|---|---:|---:|---:|---|
| `bopacorp-api` | `^0.3.2` | `0.3.2` | `0.2.17` | Drift en pnpm |
| `bopacorp-web` | `^0.3.2` | `0.3.2` | `0.2.19` con specifier `latest` | Drift en pnpm |
| `bopacorp-crm` | `^0.3.2` | `0.3.2` | `0.2.17` | Drift en pnpm |
| `bopacorp-mobile` | `^0.3.2` | enlace local a `../bopacorp-shared` | No observado | Dependencia local |

Imports directos observados en código:

- API usa root, `auth`, `catalog`, `common`, `core`, `crm`, `document-uploads`, `documents`, `employability`, `matrices`, `notifications` y `reports`.
- Web usa root, `auth`, `catalog`, `common`, `employability` e `i18n`.
- CRM usa root, `auth`, `catalog`, `common`, `core`, `crm`, `document-uploads`, `documents`, `employability`, `i18n`, `matrices` y `reports`.
- Mobile solo presenta el import root en el inventario estático disponible.

El comando `npm run test:compatibility` reporta este drift, pero no actualiza dependencias ni lockfiles.

## Hallazgo de packaging

`npm pack --dry-run` contiene los 26 archivos de runtime/declarations requeridos, por lo que el tarball funciona en un consumer temporal. Sin embargo, el package actualmente publica más contenido del necesario porque no tiene una allowlist `files` ni un `.npmignore` efectivo para este caso.

El dry-run detecta archivos bajo `src/`, `tests/`, `docs/`, `scripts/`, `.github/` y archivos internos como `AGENTS.md`, `CLAUDE.md`, configuraciones y `.npmrc.example`.

Este hallazgo queda pendiente de una corrección de packaging separada. La Fase 6 no modifica el manifiesto porque su alcance aprobado es testing y compatibilidad; antes de publicar una nueva versión se debe definir una allowlist que conserve `dist`, `package.json`, `README` y los metadatos de publicación necesarios.

## Limitaciones

- La evidencia confirma el artifact local construido desde la revisión actual; no confirma todavía la instalación desde GitHub Packages.
- La compatibilidad registrada es estática: no se actualizaron ni ejecutaron los cuatro consumidores completos.
- El drift entre lockfiles requiere una actualización coordinada en cada consumer y un retest posterior.
