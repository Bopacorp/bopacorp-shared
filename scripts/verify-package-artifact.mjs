import assert from 'node:assert/strict';

const entrypoints = {
  '@bopacorp/shared': ['PaginationQuerySchema', 'LoginRequestSchema', 'PublicCatalogItemResponseSchema'],
  '@bopacorp/shared/common': ['PaginationQuerySchema', 'UuidSchema', 'ApiSuccessSchema'],
  '@bopacorp/shared/auth': ['LoginRequestSchema', 'UserResponseSchema', 'PermissionTypeSchema'],
  '@bopacorp/shared/core': ['DepartmentResponseSchema', 'ListEmployeesQuerySchema'],
  '@bopacorp/shared/employability': ['ApplyJobVacancyRequestSchema', 'PublicJobVacancyResponseSchema'],
  '@bopacorp/shared/crm': ['CreateVisitRequestSchema', 'BusinessClientResponseSchema'],
  '@bopacorp/shared/catalog': ['ContentTypeCode', 'CatalogItemResponseSchema'],
  '@bopacorp/shared/document-uploads': ['EncryptionMetadataSchema', 'UploadDocumentResponseSchema'],
  '@bopacorp/shared/documents': ['DocumentStateSchema', 'DocumentTypeResponseSchema'],
  '@bopacorp/shared/matrices': ['ReviewOfferMatrixRequestSchema', 'OfferMatrixResponseSchema'],
  '@bopacorp/shared/notifications': ['CreateNotificationRequestSchema', 'NotificationResponseSchema'],
  '@bopacorp/shared/reports': ['ReportTypeSchema', 'AdvisorMetricResponseSchema'],
  '@bopacorp/shared/i18n': ['es', 'en', 'resolveValidationMessage'],
};

const resolved = {};
const loaded = {};

for (const [entrypoint, expectedExports] of Object.entries(entrypoints)) {
  const resolution = import.meta.resolve(entrypoint);
  assert.match(resolution, /\/dist\/[^/]+(?:\/index)?\.js$/u, `${entrypoint} no resuelve a dist`);
  const module = await import(entrypoint);
  for (const exportName of expectedExports) {
    assert.ok(exportName in module, `${entrypoint} no exporta ${exportName}`);
  }
  resolved[entrypoint] = resolution;
  loaded[entrypoint] = Object.keys(module).length;
}

const root = await import('@bopacorp/shared');
const auth = await import('@bopacorp/shared/auth');
const pagination = root.PaginationQuerySchema.parse({ page: '2', limit: '10' });
const login = auth.LoginRequestSchema.parse({
  email: 'USER@bopacorp.com',
  password: 'Password1!',
});

assert.deepEqual(pagination, { page: 2, limit: 10, sortOrder: 'asc' });
assert.equal(login.email, 'user@bopacorp.com');

console.log(
  JSON.stringify(
    {
      entrypointCount: Object.keys(entrypoints).length,
      resolved,
      loaded,
      schemaChecks: ['PaginationQuerySchema', 'LoginRequestSchema'],
    },
    null,
    2,
  ),
);
