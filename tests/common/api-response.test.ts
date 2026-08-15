import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import {
  ApiErrorSchema,
  ApiPaginatedSchema,
  ApiSuccessSchema,
  UuidSchema,
} from '../../src/common/index.js';

const ResourceSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

describe('common API response envelopes', () => {
  it('accepts a successful single-resource response', () => {
    const schema = ApiSuccessSchema(ResourceSchema);
    const result = schema.safeParse({
      success: true,
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Example resource',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid single-resource response', () => {
    const schema = ApiSuccessSchema(ResourceSchema);

    expect(schema.safeParse({ success: false, data: { id: 'bad', name: 'Example resource' } }).success).toBe(false);
    expect(schema.safeParse({ success: true }).success).toBe(false);
    expect(schema.safeParse({ success: true, data: { id: 'bad', name: 'Example resource' } }).success).toBe(false);
  });

  it('accepts an empty or populated paginated response with metadata', () => {
    const schema = ApiPaginatedSchema(ResourceSchema);
    const metadata = { page: 1, limit: 20, totalItems: 1, totalPages: 1 };

    expect(schema.safeParse({ success: true, data: [], meta: metadata }).success).toBe(true);
    expect(
      schema.safeParse({
        success: true,
        data: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Example resource' }],
        meta: metadata,
      }).success
    ).toBe(true);
  });

  it('rejects invalid items, data collections and pagination metadata', () => {
    const schema = ApiPaginatedSchema(ResourceSchema);
    const metadata = { page: 1, limit: 20, totalItems: 1, totalPages: 1 };

    expect(schema.safeParse({ success: true, data: [{ id: 'bad', name: 'Example resource' }], meta: metadata }).success).toBe(
      false
    );
    expect(schema.safeParse({ success: true, data: { id: 'bad', name: 'Example resource' }, meta: metadata }).success).toBe(
      false
    );
    expect(schema.safeParse({ success: true, data: [], meta: { page: 1 } }).success).toBe(false);
  });

  it('accepts the standard API error envelope', () => {
    expect(
      ApiErrorSchema.safeParse({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
        },
      }).success
    ).toBe(true);
  });

  it('rejects malformed API error envelopes', () => {
    expect(ApiErrorSchema.safeParse({ success: true, error: { code: 'OK', message: 'Success' } }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ success: false, error: { code: 'RESOURCE_NOT_FOUND' } }).success).toBe(false);
    expect(ApiErrorSchema.safeParse({ success: false, error: { message: 'Resource not found' } }).success).toBe(false);
  });
});
