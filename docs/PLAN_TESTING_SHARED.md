# Plan de testing por fases — `@bopacorp/shared`

**Proyecto:** BOPADIGITAL — BOPACORP S.A.
**Repositorio:** `bopacorp-shared`
**Responsabilidad:** contratos API compartidos entre `bopacorp-api`, `bopacorp-web`, `bopacorp-crm` y `bopacorp-mobile`
**Fecha base:** 15 de agosto de 2026
**Estado:** Fases 1, 2, 3, 4 y 5 implementadas localmente; CI remoto pendiente de verificación; cobertura todavía informativa.

## 1. Objetivo

Construir una suite reproducible que demuestre que los esquemas Zod y los tipos inferidos del package mantienen un contrato estable para todos sus consumidores.

El plan debe permitir verificar, con evidencia actual:

- que los datos válidos son aceptados;
- que los datos inválidos, incompletos o fuera de límite son rechazados;
- que la coerción de query params produce el tipo esperado;
- que los campos opcionales y nullable conservan la semántica de la API;
- que las respuestas no exponen datos internos del backend;
- que los tipos inferidos compilan para los consumidores;
- que los imports root y subpath funcionan desde el artifact construido;
- que una modificación incompatible sea detectada antes de publicar una nueva versión.

Este plan prueba el contrato API. No convierte al package en responsable de probar la base de datos, los endpoints, la UI o el almacenamiento de archivos.

## 2. Estado inicial comprobado

El package contiene esquemas y barrels para `common`, `auth`, `core`, `crm`, `catalog`, `documents`, `document-uploads`, `employability`, `matrices`, `notifications`, `reports` e `i18n`.

La configuración actual observada es:

| Área | Estado actual | Implicación |
|---|---|---|
| Tests runtime | No se encontraron archivos `*.test.ts`, `*.spec.ts` o equivalentes | Debe crearse el runner y la primera línea base |
| CI | Ejecuta `npm ci`, `npm run check` y `npm run build` | Todavía no bloquea por tests ni cobertura |
| Runtime | Zod 4, TypeScript ESM y Node 22 en CI | Los tests deben respetar ESM y los imports `.js` |
| Tipos | Se generan con `z.infer` | Se necesitan pruebas de compilación, no solo pruebas runtime |
| Publicación | GitHub Packages como `@bopacorp/shared` | Hay que probar el artifact empaquetado, no únicamente `src/` |
| Versión observada | `0.3.2` | Las incompatibilidades deben relacionarse con SemVer |

La ausencia de tests no significa que el package esté roto; significa que todavía no existe evidencia automatizada del comportamiento de sus contratos.

## 3. Límites de responsabilidad

### Se prueba aquí

| Contrato | Ejemplos de pruebas |
|---|---|
| Request schemas | Campos requeridos, límites, enums, coerción, optionalidad y mensajes |
| Response schemas | Forma, nullabilidad, relaciones slim y exclusión de campos internos |
| Primitivas comunes | UUID, email, RUC, identificación, teléfono, paginación y timestamps |
| API envelopes | `success`, `data`, `error` y metadata de paginación |
| Tipos inferidos | Compatibilidad TypeScript de requests y responses |
| Barrels y exports | Import root, subpaths y artifact de `dist/` |
| Mensajes compartidos | Resolución de claves, parámetros y fallback de `i18n` |

### No se prueba aquí

| Responsabilidad | Repositorio o nivel correcto |
|---|---|
| SQL, Drizzle, persistencia y migraciones | `bopacorp-api` |
| Autorización real, ownership y respuestas HTTP | Integración del API con Supertest/Vitest |
| Formularios, guards, tablas y navegación | `bopacorp-crm` o `bopacorp-web` |
| GPS, cámara, storage y comportamiento de dispositivo | Mobile, API o aceptación manual |
| Tamaño real, MIME real y carga de archivos | API/frontend; aquí solo se prueba el metadata contract definido |
| Cálculos comerciales y transiciones de negocio | Servicios del API; aquí solo se valida la forma del payload |
| Subsidios y aprobación completa de matrices | Fuera del alcance funcional vigente; cualquier schema residual se trata como compatibilidad técnica |

Una prueba de `CreateNegotiationRequestSchema` puede demostrar que el payload tiene la forma correcta. No puede demostrar que el asesor tenga permiso para crear esa negociación ni que la transacción se persista correctamente.

## 4. Principios de prueba

1. **El schema es la fuente del comportamiento runtime.** Las pruebas deben llamar `parse` o `safeParse` y verificar el resultado observable.
2. **El tipo inferido se comprueba por compilación.** Un test runtime no demuestra que `LoginRequest` o `UserResponse` sean utilizables por TypeScript.
3. **Request y response tienen semánticas distintas.** En requests se prueba omisión con `.optional()`; en responses se prueba presencia con valor `null` cuando corresponda.
4. **No se prueban detalles internos de Zod.** Se validan datos aceptados, rechazados, transformados y serializados.
5. **Los mensajes visibles deben permanecer en español.** Los nombres de código, fixtures y casos se mantienen en inglés cuando formen parte del código.
6. **Los fixtures son anónimos y deterministas.** No se guardan contraseñas reales, tokens, datos de clientes ni respuestas copiadas de producción.
7. **La cobertura no sustituye la calidad del caso.** Una línea ejecutada no demuestra una regla si no se cubren sus variantes válidas, inválidas y límite.
8. **Los cambios de contrato requieren revisión de consumidores.** API, Web, CRM y Mobile pueden necesitar actualizaciones coordinadas.

## 5. Estrategia de niveles

| Nivel | Herramienta propuesta | Propósito | Evidencia |
|---|---|---|---|
| Runtime unitario | Vitest | Ejecutar schemas, enums, primitivas y `i18n` | Consola y reporte HTML/LCOV |
| Type-level | `tsc --noEmit` o `tsd` | Verificar tipos inferidos e imports | Salida de compilación |
| Package smoke | Vitest + `npm run build` | Importar `dist/` desde root y subpaths | Test de imports y artifact |
| Consumer fixture | TypeScript en fixture aislado | Simular API/Web/CRM consumiendo el package | Compilación del fixture |
| Integración coordinada | API/Web/CRM | Detectar drift entre revisiones publicadas | SHA y resultado por repositorio |

La primera versión debe comenzar con Vitest. Es consistente con el ecosistema BOPADIGITAL y permite probar schemas sin levantar PostgreSQL, Docker, Express o un navegador.

## 6. Organización propuesta

Para no mezclar los tests con el `rootDir: src` del build, se recomienda separar la suite:

```text
tests/
├── common/
│   ├── api-response.test.ts
│   └── primitives.test.ts
├── auth/
│   ├── enums.test.ts
│   ├── request.test.ts
│   └── response.test.ts
├── core/
├── crm/
├── catalog/
├── documents/
├── employability/
├── reports/
├── notifications/
├── i18n/
├── package-exports.test.ts
├── fixtures/
├── helpers/
└── type-level/
```

Convención de IDs:

```text
SHARED-COM-001
SHARED-AUTH-001
SHARED-CRM-001
SHARED-DOC-001
SHARED-PKG-001
```

Convención de archivos:

```text
tests/<module>/<area>.test.ts
```

Los nombres de los tests deben describir comportamiento, por ejemplo:

```typescript
it('rejects an invalid UUID')
it('coerces pagination query parameters')
it('does not expose password hash in a user response')
```

## 7. Fases de ejecución

### Fase 0 — Inventario, baseline y contrato de referencia

**Objetivo:** fijar qué se está probando y contra qué revisión.

**Actividades:**

- Registrar SHA, versión de Node, npm y versión del package.
- Ejecutar y guardar la salida de `npm ci`, `npm run check` y `npm run build`.
- Confirmar todos los módulos y exports públicos de `package.json` y `src/index.ts`.
- Comparar los schemas con los contratos consumidos por `bopacorp-api`, `bopacorp-web`, `bopacorp-crm` y `bopacorp-mobile`.
- Revisar cambios contra los SQL del API cuando se modifique una entidad.
- Identificar campos sensibles que nunca deben aparecer en responses.
- Separar funcionalidad vigente, compatibilidad residual y módulos descoped.

**Entregables:**

- Inventario de schemas, tipos y subpaths.
- Lista de riesgos y consumidores afectados.
- SHA y baseline reproducible.
- Fixtures anónimos iniciales.

**Criterio de salida:** cualquier resultado posterior puede asociarse a una revisión y a una versión concreta.

### Fase 1 — Runner, scripts y CI mínimo

**Objetivo:** hacer ejecutable y visible la suite.

**Cambios propuestos:**

- Añadir Vitest y `@vitest/coverage-v8` como devDependencies.
- Crear `vitest.config.ts` para ESM y tests bajo `tests/`.
- Añadir una configuración de typecheck para tests o adoptar `tsd`.
- Añadir scripts equivalentes a:

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:typecheck": "tsc -p tsconfig.test.json --noEmit"
}
```

- Ejecutar la suite en CI después de instalar dependencias.
- Publicar `coverage/index.html` y `coverage/lcov.info` como artifact.

**Criterio de salida:** existe un test mínimo, el comando es reproducible en local y CI falla si ese test falla.

Durante esta fase no se debe activar todavía un umbral alto. Primero se debe medir la cobertura real y revisar qué código ejecutable tiene ramas relevantes.

### Resultado de ejecución de Fase 1 — 2026-08-15

- [x] Vitest `4.1.10` y `@vitest/coverage-v8` `4.1.10` añadidos como dependencias de desarrollo.
- [x] `vitest.config.ts` creado con entorno Node, tests bajo `tests/` y reportes text/HTML/LCOV.
- [x] `tsconfig.test.json` creado para compilar `src`, `tests` y la configuración de Vitest sin emitir archivos.
- [x] Smoke test creado: 1 archivo y 3 tests exitosos.
- [x] `npm run check` exitoso: Biome lint sobre 44 archivos y TypeScript sin errores.
- [x] `npm run test:typecheck` exitoso.
- [x] `npm run test:coverage` exitoso; reportes generados en `coverage/`.
- [x] `npm run build` exitoso.
- [x] CI actualizado para ejecutar tests, typecheck, cobertura y upload de artifacts siempre.
- [x] `check` dejó de escribir en `src/`; el formateo sigue siendo explícito mediante `lint:fix` y `format`.
- [x] Se removió un import no usado preexistente en `src/matrices/request.ts` para que el lint estático pasara.
- [ ] Run remoto de GitHub Actions y artifact remoto pendientes.
- [ ] Gate porcentual de cobertura pendiente; los valores actuales son baseline, no criterio de cumplimiento.

La ejecución local de cobertura reportó **94.4% de statements, 33.33% de branches, 46.15% de functions y 95.88% de lines** sobre 44 archivos cargados por el entrypoint. El smoke test importa el root, `common` y contratos representativos; la cobertura funcional por módulo corresponde a las fases siguientes.

### Fase 2 — Primitivas comunes y envelopes

**Prioridad:** crítica, porque todos los módulos dependen de estas reglas.

**Casos mínimos:**

| ID | Contrato | Casos |
|---|---|---|
| SHARED-COM-001 | `UuidSchema` | UUID válido, formato inválido, vacío y valor no string |
| SHARED-COM-002 | `EmailSchema` / `CorporateEmailSchema` | email válido, formato inválido, dominio no permitido y límites |
| SHARED-COM-003 | `EcuadorianIdSchema`, `RucSchema`, `NationalIdSchema` | longitudes, caracteres inválidos y datos límite definidos por el contrato |
| SHARED-COM-004 | `PhoneSchema` | valores válidos, vacío, caracteres inválidos y longitud límite |
| SHARED-COM-005 | `PaginationQuerySchema` | coerción de strings, defaults, mínimo/máximo, orden y query inválido |
| SHARED-COM-006 | `PaginationMetaSchema` / `TimestampsSchema` | números enteros, timestamps ISO, nulabilidad y campos requeridos |
| SHARED-COM-007 | `ApiSuccessSchema` | envelope válido y rechazo de `success` o `data` incompatibles |
| SHARED-COM-008 | `ApiPaginatedSchema` | data, metadata y composición de respuesta paginada |
| SHARED-COM-009 | `ApiErrorSchema` | código, mensaje, detalles opcionales y datos inválidos |

Debe verificarse el comportamiento actual de primitivas como `IpAddressSchema` y `UserAgentSchema` contra el requisito real. Si una primitive solo limita longitud y no valida semántica, el test debe documentar ese hecho y no inventar una garantía que el schema no ofrece.

**Criterio de salida:** los contratos comunes tienen casos positivos, negativos y de frontera; cualquier comportamiento dudoso queda registrado como decisión o deuda.

### Resultado de ejecución de Fase 2 — 2026-08-15

- [x] Tests de primitivas comunes creados en `tests/common/primitives.test.ts`.
- [x] Tests de envelopes creados en `tests/common/api-response.test.ts`.
- [x] Suite exitosa: 3 archivos y 24 tests.
- [x] Se verificaron UUID, emails, dominio corporativo, límites de metadata, boolean query, paginación, timestamps, identificadores ecuatorianos, teléfonos y envelopes de éxito/error.
- [x] Se registró el comportamiento actual de `CorporateEmailSchema`: acepta `@bopacorp.com` en minúsculas y rechaza el dominio en mayúsculas; no se cambió el schema.
- [x] `npm run check` exitoso: Biome lint sobre 44 archivos y TypeScript sin errores.
- [x] `npm run test:typecheck` exitoso.
- [x] `npm run test:coverage` exitoso: 95.34% de statements, 41.66% de branches, 61.53% de functions y 96.51% de lines.
- [x] `npm run build` exitoso y `git diff --check` sin errores.
- [ ] Run remoto de GitHub Actions y artifact remoto pendientes.
- [ ] Gate porcentual de cobertura pendiente; los valores actuales siguen siendo baseline.

No se modificaron schemas, exports ni la API pública durante Fase 2. Los casos documentan el comportamiento observable vigente para que una futura corrección de contrato pueda evaluarse de forma explícita.

### Fase 3 — Auth, seguridad, privacidad y organización

**Prioridad:** crítica, porque un error de contrato puede afectar autenticación y exposición de datos.

**Casos mínimos:**

- Enums de permisos, tokens, login y auditoría aceptan solo valores definidos.
- Login, refresh, logout, cambio, recuperación y reset de contraseña exigen sus campos correctos.
- Requests de create/update respetan required, optional y partial semantics.
- IDs, emails y role IDs conservan sus primitivas comunes.
- Responses de usuario, perfil, roles y permisos aceptan relaciones esperadas.
- `ModuleTreeResponseSchema` valida árboles anidados y rechaza children malformados.
- Responses no exponen `password_hash`, `failed_login_attempts`, `locked_until`, `deleted_at`, IP, user-agent ni auditoría interna.
- Tokens crudos aparecen únicamente en los responses de login/refresh donde el contrato los define.
- Profile, employee, department, organizational role y advisor-supervisor conservan nulabilidad y referencias slim.

**Pruebas de privacidad recomendadas:**

1. Crear un fixture de response con campos internos incluidos.
2. Ejecutar el schema.
3. Verificar que el resultado serializable no contiene esos campos.
4. Repetir la verificación para responses completos y list items.

La suite del package no prueba que un usuario tenga permiso para ejecutar una operación. Esa decisión corresponde al API; aquí se prueba que el payload público no exponga internals.

**Criterio de salida:** auth/core tienen cobertura de datos válidos, inválidos, nullables, parciales y privacidad.

### Resultado de ejecución de Fase 3 — 2026-08-15

- [x] Tests de enums y requests de `auth` creados en `tests/auth/enums.test.ts` y `tests/auth/request.test.ts`.
- [x] Tests de responses de `auth` y privacidad creados en `tests/auth/response.test.ts`.
- [x] Tests de requests y responses de `core` creados en `tests/core/request.test.ts` y `tests/core/response.test.ts`.
- [x] Suite exitosa: 8 archivos y 60 tests.
- [x] Se verificaron enums, autenticación, contraseñas, defaults, partial semantics, filtros, relaciones, nulabilidad, árboles recursivos y responses de organización.
- [x] Se verificó que los campos backend-only enviados como claves desconocidas no aparecen en los responses serializados evaluados.
- [x] Se verificó que `MeResponseSchema` no expone tokens; los tokens permanecen limitados al response de autenticación donde el contrato los define.
- [x] `npm run check` exitoso: Biome lint sobre 44 archivos y TypeScript sin errores.
- [x] `npm run test:typecheck` exitoso.
- [x] `npm run test:coverage` exitoso: 95.96% de statements, 41.66% de branches, 76.92% de functions y 97.15% de lines.
- [x] `npm run build` exitoso y `git diff --check` sin errores.
- [ ] Run remoto de GitHub Actions y artifact remoto pendientes.
- [ ] Gate porcentual de cobertura pendiente; los valores actuales siguen siendo baseline.

Hallazgo conocido: `EmployeeResponseSchema` incluye explícitamente `deletedAt`. La prueba lo mantiene visible como excepción del contrato de privacidad; Fase 3 no modifica el schema porque su alcance es únicamente de evidencia.

### Fase 4 — CRM, documentos y contratos de archivos

**Prioridad:** crítica para el flujo comercial.

**CRM:**

- clientes empresariales con RUC, razón social, servicios y facturación;
- negociaciones y estados con enums y referencias correctas;
- cambio de estado con la forma esperada del payload;
- visitas con fecha, observación, coordenadas y verificación;
- queries de clientes, negociaciones y visitas con paginación y filtros;
- responses completos, list items, historial y relaciones slim.

**Documentos:**

- tipos documentales y documentos asociados a negociación;
- estados `PENDING_APPROVAL`, `ACCEPTED` y `REJECTED`;
- cambio de estado y motivo opcional/obligatorio según el contrato vigente;
- historial de estados y nulabilidad de reviewer/rejection data;
- response de upload y metadata de cifrado cuando corresponda.

**Límite importante:** el package no inspecciona bytes, MIME real, malware, storage ni límite físico de 50 MB. Esos casos deben probarse en API/frontend. Aquí se verifica únicamente que el request/response documentado tenga la estructura correcta.

**Criterio de salida:** el flujo de payload cliente → negociación → visita → documento tiene fixtures de request y response que puedan reutilizar API y CRM.

### Resultado de ejecución de Fase 4 — 2026-08-15

- [x] Tests de requests y filtros CRM creados en `tests/crm/request.test.ts`.
- [x] Tests de responses CRM, relaciones slim y campos nullable creados en `tests/crm/response.test.ts`.
- [x] Tests de requests, estados, límites de metadata y actualización estricta creados en `tests/documents/request.test.ts`.
- [x] Tests de responses completos/list items e historial creados en `tests/documents/response.test.ts`.
- [x] Tests de encryption metadata y upload response creados en `tests/document-uploads.test.ts`.
- [x] Suite exitosa: 13 archivos y 80 tests.
- [x] Se verificaron clientes, negociaciones, visitas, GPS tipado, estados documentales, relaciones anidadas, referencias slim, historial y fronteras de archivo `0.01–50 MB`.
- [x] Se verificó que `Update*Schema` derivado con `.partial()` conserva defaults existentes como `isActive: true`; no se modificaron schemas.
- [x] Se verificó que los list items eliminan campos de detalle desconocidos al serializarse.
- [x] `npm run check` exitoso: Biome lint sobre 44 archivos y TypeScript sin errores.
- [x] `npm run test:typecheck` exitoso.
- [x] `npm run test:coverage` exitoso: 95.96% de statements, 41.66% de branches, 76.92% de functions y 97.15% de lines.
- [x] `npm run build` exitoso y `git diff --check` sin errores.
- [ ] Run remoto de GitHub Actions y artifact remoto pendientes.
- [ ] Gate porcentual de cobertura pendiente; los valores actuales siguen siendo baseline.

Los tests no inspeccionan bytes, MIME real, malware, storage, autorización, ownership ni transiciones de negocio. Esas garantías requieren pruebas del API/frontend o pruebas de integración coordinadas.

### Fase 5 — Catálogo, empleabilidad, reportes, notificaciones e i18n

**Catálogo:**

- enums y códigos de tipo de contenido;
- detalles específicos por producto cuando el schema los define;
- condiciones, beneficios, categorías y referencias;
- requests públicos y administrativos con separación correcta.

**Empleabilidad:**

- vacantes publicadas y no publicadas;
- application states;
- formulario público de postulación;
- candidato, CV y application responses sin mezclar datos internos;
- queries con filtros y paginación.

**Reportes y notificaciones:**

- tipos de reporte y tier codes;
- requests de métricas, performance, exports y targets;
- responses con valores nullable cuando no existe dato;
- notification requests y list items;
- no asumir que un schema implementa el cálculo de métricas o el envío real.

**i18n:**

- clave conocida con parámetros;
- clave desconocida conserva fallback;
- parámetros faltantes no rompen la resolución;
- sustitución de múltiples parámetros;
- locale completo y locale parcial según el contrato de tipos.

**Matrices:**

El package conserva schemas de matrices. Por decisión funcional vigente, esta fase no debe presentarlos como evidencia de que la funcionalidad de subsidios o aprobación está implementada. Se pueden mantener smoke tests de enum, parse y exports para evitar romper consumidores mientras exista el código residual.

**Criterio de salida:** los módulos públicos y administrativos tienen al menos fixtures representativos y los casos de privacidad/nullable más importantes.

### Resultado de ejecución de Fase 5 — 2026-08-15

- [x] Tests de requests y responses de catálogo creados en `tests/catalog/request.test.ts` y `tests/catalog/response.test.ts`.
- [x] Tests de empleabilidad pública y administrativa creados en `tests/employability/request.test.ts` y `tests/employability/response.test.ts`.
- [x] Tests de reportes, notificaciones e i18n creados en `tests/reports.test.ts`, `tests/notifications.test.ts` y `tests/i18n.test.ts`.
- [x] Smoke tests residuales de matrices creados en `tests/matrices.test.ts`.
- [x] Suite exitosa: 21 archivos y 117 tests.
- [x] Se verificaron lookups, categorías recursivas, detalles de catálogo, condiciones, CMS, proyección pública, vacantes públicas, aplicaciones, resumes PDF, estados, métricas, exports, notificaciones, mensajes i18n y matrices residuales.
- [x] Se verificó que `PublicCatalogItemResponseSchema` elimina campos administrativos, pero conserva `permanenceMonths` como parte del contrato público actual.
- [x] Se verificó que `resolveValidationMessage` se consume desde `src/i18n/index.ts` y que las claves de los locales `es`/`en` permanecen alineadas.
- [x] Se registró que el branch `approved` de `ReviewOfferMatrixRequestSchema` elimina `rejectionReason` desconocido en lugar de rechazarlo; no se modificó el schema.
- [x] `npm run check` exitoso: Biome lint sobre 44 archivos y TypeScript sin errores.
- [x] `npm run test:typecheck` exitoso.
- [x] `npm run test:coverage` exitoso: 100% de statements, 91.66% de branches, 100% de functions y 100% de lines.
- [x] `npm run build` exitoso y `git diff --check` sin errores.
- [ ] Run remoto de GitHub Actions y artifact remoto pendientes.
- [ ] Gate porcentual de cobertura pendiente; los valores actuales siguen siendo baseline.

Los tests no ejecutan cálculos comerciales, elegibilidad laboral, envío de notificaciones, generación real de reportes ni flujo productivo de matrices. Esas garantías requieren API, frontend o integración coordinada.

### Fase 6 — Type-level, exports y compatibilidad del artifact

**Objetivo:** comprobar que lo que se publica funciona como package, no solo como código fuente.

**Casos mínimos:**

- importar el root `@bopacorp/shared`;
- importar cada subpath definido en `package.json`;
- compilar requests y responses con tipos inferidos;
- comprobar que un campo inválido no compila en un fixture TypeScript;
- comprobar que un response válido sí compila;
- ejecutar tests contra `dist/` después de `npm run build`;
- crear un `npm pack --dry-run` y verificar que incluye declarations y JavaScript necesarios;
- instalar el tarball en un consumer fixture temporal y ejecutar import/typecheck.

**Compatibilidad con consumidores:**

- comparar exports requeridos por API, Web, CRM y Mobile;
- registrar la versión instalada en cada consumer;
- detectar drift de versiones antes de publicar;
- no editar consumidores ni actualizar versiones automáticamente como parte de esta suite.

**Criterio de salida:** root, subpaths, declarations y artifact empaquetado pasan un smoke test de runtime y compilación.

### Resultado de ejecución de Fase 6 — 2026-08-15

- [x] Smoke test del root y los 12 subpaths declarados; los 13 entrypoints resuelven desde `dist/`.
- [x] Fixture type-level válido compilado contra las declarations del package.
- [x] Fixture type-level inválido rechazó el campo `notAContractField`.
- [x] `npm pack --dry-run` verificó la presencia de los 26 archivos `.js`/`.d.ts` correspondientes a los entrypoints.
- [x] Consumer temporal instalado desde el tarball; runtime, imports y typecheck exitosos.
- [x] Inventario estático de imports y versiones de API, Web, CRM y Mobile creado en `docs/PHASE6_CONSUMER_COMPATIBILITY.md`.
- [x] Se detectó drift en lockfiles pnpm de API (`0.2.17`), Web (`0.2.19`) y CRM (`0.2.17`); Mobile mantiene un enlace local al package.
- [ ] Packaging hygiene pendiente: el tarball aún incluye `src/`, `tests/`, `docs/`, scripts y archivos internos; la Fase 6 lo reporta sin cambiar el manifiesto.
- [ ] Instalación desde GitHub Packages y ejecución completa de cada consumer pendientes.

### Fase 7 — Cobertura, quality gate y evidencia de release

**Objetivo:** convertir la suite en una protección permanente del contrato.

**Gate propuesto:**

| Métrica | Criterio |
|---|---|
| Tests runtime | 100% pasan |
| Typecheck de tests | 100% pasa |
| Cobertura global | Al menos 80% de statements, branches, functions y lines |
| Ramas críticas | Casos de coerción, union, refine, nullable, optional, privacidad y fallback cubiertos |
| Build | `npm run build` exitoso |
| Lint/typecheck | `npm run check` exitoso |
| Exports | Root y subpaths importables desde `dist/` |
| Package smoke | `npm pack` requerido; archivos extra se reportan como hallazgo separado |

El umbral se activa sobre la línea base actual. Las exclusiones se mantienen limitadas a declaraciones generadas y deben documentarse; no se usarán para ocultar schemas difíciles.

**Evidencia por ejecución:**

| Campo | Registro requerido |
|---|---|
| ID | `SHARED-F<fase>-YYYY-MM-DD-##` |
| Revisión | SHA del package y versión |
| Ambiente | Node, npm y sistema operativo |
| Comandos | `test:run`, `test:coverage`, typecheck, build, package smoke |
| Resultado | tests, fallos, cobertura y duración |
| Artifact | HTML, LCOV, consola y tarball si aplica |
| Consumidores | versión probada en API/Web/CRM/Mobile |
| Defectos | issue, fix SHA y retest |
| Decisión | compatible, breaking, descoped o pendiente |

### Resultado de implementación de Fase 7 — 2026-08-15

- [x] Thresholds globales de Vitest configurados en 80% para statements, branches, functions y lines.
- [x] `npm run test:phase7` consolidó check, tests, typecheck, cobertura, build, exports, type-level y consumer tarball.
- [x] Se agregó evidencia JSON con SHA, versión, ambiente, estado, duración, cobertura y artifacts.
- [x] GitHub Actions ejecuta el quality gate y sube cobertura más evidencia aun cuando el gate falla.
- [x] La cobertura local de la revisión actual supera el gate: 100% statements, 91.66% branches, 100% functions y 100% lines.
- [ ] Run remoto de GitHub Actions pendiente de ejecución en GitHub.
- [ ] Packaging hygiene y publicación en GitHub Packages permanecen fuera de esta fase.

## 8. Priorización de casos

| Prioridad | Riesgo | Primera cobertura |
|---|---|---|
| P0 | Contrato común mal validado | Primitives, pagination, API envelopes |
| P0 | Exposición de datos internos | Auth/core response schemas |
| P0 | Drift entre API y frontends | Exports, type-level y package smoke |
| P0 | Payload comercial incompatible | CRM, documents y upload response |
| P1 | Postulación o catálogo roto | Catalog y employability |
| P1 | Query o response de reportes inconsistente | Reports y notifications |
| P1 | Mensaje de validación ilegible o sin resolver | i18n |
| P2 | Regresión de módulo descoped | Matrices y metadata residual |

## 9. Definition of done por schema

Un schema puede marcarse como cubierto cuando tiene:

- un fixture válido;
- al menos un fixture inválido;
- casos de límite para tamaño, cantidad, fecha o enum cuando apliquen;
- prueba explícita de optional/nullability;
- prueba de coerción cuando se use en query params;
- prueba del tipo inferido;
- import desde el barrel correspondiente;
- resultado registrado con SHA y artifact;
- limitación documentada si la regla real pertenece al API o frontend.

## 10. Orden recomendado

1. Fase 0: baseline, inventario y fixtures.
2. Fase 1: Vitest, typecheck de tests y CI mínimo.
3. Fase 2: primitives y API envelopes.
4. Fase 3: auth, privacidad y core.
5. Fase 4: CRM, documentos y upload contracts.
6. Fase 5: catálogo, empleabilidad, reportes, notificaciones e i18n.
7. Fase 6: type-level, exports y tarball.
8. Fase 7: cobertura, gate y evidencia de release.

No conviene empezar por tests de cada módulo de negocio antes de cubrir `common`: una primitive o envelope incorrecto puede invalidar todos los consumidores a la vez.

## 11. Comandos de cierre propuestos

```bash
npm ci
npm run test:phase7
npm run test:compatibility
```

Estos comandos deben ejecutarse sobre una revisión conocida. `test:phase7` produce `artifacts/release-evidence.json`; `test:compatibility` permanece informativo porque no modifica consumidores ni lockfiles.
