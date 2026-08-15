import { describe, expect, it } from 'vitest';
import {
  AssignRolePermissionsRequestSchema,
  AssignUserRolesRequestSchema,
  ChangePasswordRequestSchema,
  CreateModuleRequestSchema,
  CreatePermissionRequestSchema,
  CreateRoleRequestSchema,
  CreateUserRequestSchema,
  ForgotPasswordRequestSchema,
  IdParamSchema,
  ListModulesQuerySchema,
  ListPermissionsQuerySchema,
  ListRolesQuerySchema,
  ListUsersQuerySchema,
  LoginRequestSchema,
  LogoutRequestSchema,
  RefreshTokenRequestSchema,
  ResetPasswordRequestSchema,
  UnlockUserRequestSchema,
  UpdateModuleRequestSchema,
  UpdatePermissionRequestSchema,
  UpdateRoleRequestSchema,
  UpdateUserRequestSchema,
} from '../../src/auth/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const strongPassword = 'StrongPass1!';
const profile = {
  firstName: 'Ana',
  lastName: 'Perez',
  nationalId: '0102030405',
  phone: '0991234567',
};
const createUserRequest = {
  username: 'ana.perez',
  email: 'ana@bopacorp.com',
  password: strongPassword,
  profile,
  roleIds: [uuid],
};

describe('auth requests', () => {
  describe('authentication actions', () => {
    it('normalizes the login email and validates the corporate domain', () => {
      expect(
        LoginRequestSchema.parse({
          email: 'ANA@bopacorp.com',
          password: 'anything',
        })
      ).toEqual({
        email: 'ana@bopacorp.com',
        password: 'anything',
      });
      expect(LoginRequestSchema.safeParse({ email: 'ana@example.com', password: 'anything' }).success).toBe(false);
    });

    it('normalizes the forgot-password email and requires a password value', () => {
      expect(ForgotPasswordRequestSchema.parse({ email: 'ANA@bopacorp.com' }).email).toBe('ana@bopacorp.com');
      expect(LoginRequestSchema.safeParse({ email: 'ana@bopacorp.com', password: '' }).success).toBe(false);
    });

    it('requires non-empty refresh tokens for logout and refresh', () => {
      expect(LogoutRequestSchema.safeParse({ refreshToken: 'refresh-token' }).success).toBe(true);
      expect(RefreshTokenRequestSchema.safeParse({ refreshToken: 'refresh-token' }).success).toBe(true);
      expect(LogoutRequestSchema.safeParse({ refreshToken: '' }).success).toBe(false);
      expect(RefreshTokenRequestSchema.safeParse({}).success).toBe(false);
    });

    it('requires a token and a valid password for password reset', () => {
      expect(
        ResetPasswordRequestSchema.safeParse({ token: 'reset-token', newPassword: strongPassword }).success
      ).toBe(true);
      expect(ResetPasswordRequestSchema.safeParse({ token: '', newPassword: strongPassword }).success).toBe(false);
      expect(ResetPasswordRequestSchema.safeParse({ token: 'reset-token', newPassword: 'weak' }).success).toBe(false);
    });
  });

  describe('password rules', () => {
    it('accepts passwords at the minimum and maximum lengths', () => {
      const minimumPassword = 'Aa1!aaaa';
      const maximumPassword = `A${'a'.repeat(125)}1!`;

      expect(ChangePasswordRequestSchema.safeParse({ currentPassword: 'old', newPassword: minimumPassword }).success).toBe(
        true
      );
      expect(ChangePasswordRequestSchema.safeParse({ currentPassword: 'old', newPassword: maximumPassword }).success).toBe(
        true
      );
    });

    it('rejects passwords outside the length and character constraints', () => {
      const tooLongPassword = `A${'a'.repeat(126)}1!`;
      const invalidPasswords = ['short1!', 'lowercase1!', 'UPPERCASE1!', 'NoDigits!!', 'NoSpecial11', tooLongPassword];

      for (const newPassword of invalidPasswords) {
        expect(ChangePasswordRequestSchema.safeParse({ currentPassword: 'old', newPassword }).success).toBe(false);
      }
      expect(ChangePasswordRequestSchema.safeParse({ currentPassword: '', newPassword: strongPassword }).success).toBe(false);
    });
  });

  describe('user management', () => {
    it('applies the active default and accepts a complete create-user request', () => {
      expect(CreateUserRequestSchema.parse(createUserRequest)).toMatchObject({
        isActive: true,
        username: 'ana.perez',
        roleIds: [uuid],
      });
    });

    it('rejects incomplete users, empty role assignments and invalid profile fields', () => {
      expect(CreateUserRequestSchema.safeParse({ ...createUserRequest, roleIds: [] }).success).toBe(false);
      expect(CreateUserRequestSchema.safeParse({ ...createUserRequest, profile: { ...profile, nationalId: 'bad' } }).success).toBe(
        false
      );
      expect(
        CreateUserRequestSchema.safeParse({
          ...createUserRequest,
          profile: { ...profile, avatarUrl: 'not-a-url' },
        }).success
      ).toBe(false);
      expect(CreateUserRequestSchema.safeParse({ ...createUserRequest, username: '' }).success).toBe(false);
    });

    it('preserves partial semantics for user updates', () => {
      expect(UpdateUserRequestSchema.parse({})).toEqual({});
      expect(UpdateUserRequestSchema.parse({ email: 'new@bopacorp.com', profile: { firstName: 'New' } })).toEqual({
        email: 'new@bopacorp.com',
        profile: { firstName: 'New' },
      });
      expect(UpdateUserRequestSchema.safeParse({ isActive: 'true' }).success).toBe(false);
    });

    it('validates unlock reasons and trims accepted values', () => {
      expect(UnlockUserRequestSchema.parse({ reason: '  ten chars!  ' }).reason).toBe('ten chars!');
      expect(UnlockUserRequestSchema.safeParse({ reason: 'too short' }).success).toBe(false);
      expect(UnlockUserRequestSchema.safeParse({ reason: 'x'.repeat(501) }).success).toBe(false);
    });

    it('validates route IDs and role assignment payloads', () => {
      expect(IdParamSchema.safeParse({ id: uuid }).success).toBe(true);
      expect(IdParamSchema.safeParse({ id: 'bad' }).success).toBe(false);
      expect(AssignUserRolesRequestSchema.safeParse({ roleIds: [uuid, secondUuid] }).success).toBe(true);
      expect(AssignUserRolesRequestSchema.safeParse({ roleIds: [] }).success).toBe(false);
    });
  });

  describe('role, module and permission management', () => {
    it('applies defaults and partial semantics to roles and modules', () => {
      expect(CreateRoleRequestSchema.parse({ name: 'Admin', slug: 'admin' })).toMatchObject({ isActive: true });
      expect(UpdateRoleRequestSchema.parse({ description: 'Updated role' })).toEqual({ description: 'Updated role' });
      expect(CreateModuleRequestSchema.parse({ name: 'CRM', code: 'CRM' })).toMatchObject({
        sortOrder: 0,
        isActive: true,
      });
      expect(UpdateModuleRequestSchema.parse({ parentId: null })).toEqual({ parentId: null });
    });

    it('validates permission creation and role-permission assignments', () => {
      expect(
        CreatePermissionRequestSchema.safeParse({
          moduleId: uuid,
          code: 'crm.read',
          name: 'Read CRM',
          type: 'crud',
        }).success
      ).toBe(true);
      expect(
        CreatePermissionRequestSchema.safeParse({
          moduleId: uuid,
          code: 'crm.read',
          name: 'Read CRM',
          type: 'unknown',
        }).success
      ).toBe(false);
      expect(
        AssignRolePermissionsRequestSchema.safeParse({
          permissions: [{ permissionId: uuid, isGranted: true }],
        }).success
      ).toBe(true);
      expect(AssignRolePermissionsRequestSchema.safeParse({ permissions: [] }).success).toBe(false);
    });

    it('coerces list filters and validates UUID and enum filters', () => {
      expect(ListUsersQuerySchema.parse({ isActive: 'true' }).isActive).toBe(true);
      expect(ListRolesQuerySchema.parse({ isActive: 'false', search: 'admin' }).isActive).toBe(false);
      expect(ListModulesQuerySchema.parse({ parentId: uuid }).parentId).toBe(uuid);
      expect(
        ListPermissionsQuerySchema.parse({ moduleId: uuid, type: 'view', isActive: 'true' })
      ).toMatchObject({ moduleId: uuid, type: 'view', isActive: true });
      expect(ListModulesQuerySchema.safeParse({ parentId: 'bad' }).success).toBe(false);
      expect(ListPermissionsQuerySchema.safeParse({ type: 'invalid' }).success).toBe(false);
    });
  });
});
