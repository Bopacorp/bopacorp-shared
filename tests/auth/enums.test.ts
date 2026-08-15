import { describe, expect, it } from 'vitest';
import {
  AuditOperationSchema,
  LoginStatusSchema,
  PermissionTypeSchema,
  TokenTypeSchema,
} from '../../src/auth/index.js';

describe('auth enums', () => {
  it('accepts every configured permission type', () => {
    for (const value of ['crud', 'action', 'report', 'view', 'approval']) {
      expect(PermissionTypeSchema.safeParse(value).success).toBe(true);
    }
  });

  it('accepts every configured token type', () => {
    for (const value of ['refresh', 'password_reset', 'email_verify']) {
      expect(TokenTypeSchema.safeParse(value).success).toBe(true);
    }
  });

  it('accepts every configured login status', () => {
    for (const value of ['success', 'failed', 'locked']) {
      expect(LoginStatusSchema.safeParse(value).success).toBe(true);
    }
  });

  it('accepts every configured audit operation', () => {
    for (const value of ['I', 'U', 'D']) {
      expect(AuditOperationSchema.safeParse(value).success).toBe(true);
    }
  });

  it('rejects unknown, empty and non-string enum values', () => {
    expect(PermissionTypeSchema.safeParse('CRUD').success).toBe(false);
    expect(TokenTypeSchema.safeParse('access').success).toBe(false);
    expect(LoginStatusSchema.safeParse('').success).toBe(false);
    expect(AuditOperationSchema.safeParse(1).success).toBe(false);
  });
});
