import { describe, expect, it } from 'vitest';
import {
  ApiSuccessSchema,
  LoginRequestSchema,
  PaginationQuerySchema,
} from '../src/index.js';
import { UuidSchema } from '../src/common/index.js';

describe('package exports', () => {
  it('exports schemas from the root entrypoint', () => {
    const pagination = PaginationQuerySchema.parse({ page: '2', limit: '10' });
    const login = LoginRequestSchema.parse({
      email: 'TEST@bopacorp.com',
      password: 'Password1!',
    });

    expect(pagination).toEqual({
      page: 2,
      limit: 10,
      sortOrder: 'asc',
    });
    expect(login.email).toBe('test@bopacorp.com');
  });

  it('exports schemas from a subpath entrypoint', () => {
    expect(UuidSchema.safeParse('not-a-uuid').success).toBe(false);
    expect(UuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true);
  });

  it('validates a generic API success envelope', () => {
    const responseSchema = ApiSuccessSchema(PaginationQuerySchema);
    const result = responseSchema.safeParse({
      success: true,
      data: { page: 1, limit: 20 },
    });

    expect(result.success).toBe(true);
  });
});
