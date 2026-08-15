import { describe, expect, it } from 'vitest';
import {
  AuthTokensResponseSchema,
  LockStatusResponseSchema,
  LoginResponseSchema,
  MeResponseSchema,
  MessageResponseSchema,
  ModuleResponseSchema,
  ModuleTreeResponseSchema,
  PermissionResponseSchema,
  RoleDetailResponseSchema,
  RoleResponseSchema,
  UserListItemResponseSchema,
  UserResponseSchema,
  UnlockUserResponseSchema,
} from '../../src/auth/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const profile = {
  id: uuid,
  firstName: 'Ana',
  secondName: null,
  lastName: 'Perez',
  secondLastName: null,
  nationalId: '0102030405',
  phone: '0991234567',
  avatarUrl: null,
  address: null,
};
const moduleResponse = {
  id: uuid,
  parentId: null,
  name: 'CRM',
  code: 'CRM',
  description: null,
  sortOrder: 0,
  isActive: true,
  ...timestamps,
};
const userResponse = {
  id: uuid,
  username: 'ana.perez',
  email: 'ana@bopacorp.com',
  isActive: true,
  lastLoginAt: null,
  profile,
  roles: [{ id: secondUuid, name: 'Admin', slug: 'admin' }],
  ...timestamps,
};

describe('auth responses', () => {
  it('validates auth tokens and login responses with nullable profiles', () => {
    expect(AuthTokensResponseSchema.safeParse({ accessToken: 'access', refreshToken: 'refresh', expiresIn: 3600 }).success).toBe(
      true
    );
    expect(AuthTokensResponseSchema.safeParse({ accessToken: 'access', refreshToken: 'refresh', expiresIn: 1.5 }).success).toBe(
      false
    );
    expect(
      LoginResponseSchema.safeParse({
        user: {
          id: uuid,
          username: 'ana.perez',
          email: 'ana@bopacorp.com',
          roles: ['admin'],
          permissions: ['crm.read'],
          profile: null,
        },
        tokens: { accessToken: 'access', refreshToken: 'refresh', expiresIn: 3600 },
      }).success
    ).toBe(true);
  });

  it('validates me and user responses with nested role and profile data', () => {
    expect(MeResponseSchema.safeParse({ ...userResponse, roles: ['admin'] }).success).toBe(true);
    expect(UserResponseSchema.safeParse(userResponse).success).toBe(true);
    expect(UserResponseSchema.safeParse({ ...userResponse, lastLoginAt: 'not-a-date' }).success).toBe(false);
    expect(UserResponseSchema.safeParse({ ...userResponse, roles: [{ id: 'bad' }] }).success).toBe(false);
  });

  it('validates permission, role and role-detail relationships', () => {
    const permission = {
      id: uuid,
      moduleId: secondUuid,
      code: 'crm.read',
      name: 'Read CRM',
      description: null,
      type: 'crud',
      isActive: true,
      ...timestamps,
    };
    const role = {
      id: secondUuid,
      name: 'Admin',
      slug: 'admin',
      description: null,
      isActive: true,
      ...timestamps,
    };

    expect(PermissionResponseSchema.safeParse(permission).success).toBe(true);
    expect(RoleResponseSchema.safeParse(role).success).toBe(true);
    expect(
      RoleDetailResponseSchema.safeParse({
        ...role,
        permissions: [{ id: uuid, code: 'crm.read', name: 'Read CRM', type: 'crud', isGranted: true }],
      }).success
    ).toBe(true);
    expect(
      RoleDetailResponseSchema.safeParse({
        ...role,
        permissions: [{ id: uuid, code: 'crm.read', name: 'Read CRM', type: 'invalid', isGranted: true }],
      }).success
    ).toBe(false);
  });

  it('validates modules and recursively validates module trees', () => {
    expect(ModuleResponseSchema.safeParse(moduleResponse).success).toBe(true);
    expect(
      ModuleTreeResponseSchema.safeParse({
        ...moduleResponse,
        children: [{ ...moduleResponse, id: secondUuid, parentId: uuid, children: [] }],
      }).success
    ).toBe(true);
    expect(
      ModuleTreeResponseSchema.safeParse({
        ...moduleResponse,
        children: [{ ...moduleResponse, id: secondUuid, parentId: uuid }],
      }).success
    ).toBe(false);
  });

  it('validates list, lock and message responses', () => {
    expect(
      UserListItemResponseSchema.safeParse({
        ...userResponse,
        profile: { firstName: 'Ana', lastName: 'Perez', avatarUrl: null },
        roles: ['admin'],
      }).success
    ).toBe(true);
    expect(
      UnlockUserResponseSchema.safeParse({ id: uuid, unlocked: true, message: 'User unlocked' }).success
    ).toBe(true);
    expect(
      LockStatusResponseSchema.safeParse({
        id: uuid,
        isActive: true,
        isLocked: false,
        lockedUntil: null,
      }).success
    ).toBe(true);
    expect(MessageResponseSchema.safeParse({ message: 'Done' }).success).toBe(true);
    expect(MessageResponseSchema.safeParse({}).success).toBe(false);
  });

  it('strips backend-only fields from user responses', () => {
    const forbiddenFields = [
      'password_hash',
      'failed_login_attempts',
      'locked_until',
      'deleted_at',
      'ip_address',
      'user_agent',
      'old_data',
      'new_data',
    ];
    const result = UserResponseSchema.safeParse({
      ...userResponse,
      password_hash: 'not-a-password',
      failed_login_attempts: 3,
      locked_until: '2026-08-15T14:00:00.000Z',
      deleted_at: null,
      ip_address: '127.0.0.1',
      user_agent: 'test-agent',
      old_data: {},
      new_data: {},
    });

    expect(result.success).toBe(true);
    if (result.success) {
      for (const field of forbiddenFields) {
        expect(field in result.data).toBe(false);
      }
    }
  });

  it('does not expose tokens through the me response', () => {
    const result = MeResponseSchema.safeParse({
      ...userResponse,
      roles: ['admin'],
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('accessToken' in result.data).toBe(false);
      expect('refreshToken' in result.data).toBe(false);
    }
  });
});
