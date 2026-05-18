import { z } from 'zod';
import { EmailSchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { PermissionTypeSchema } from './enums.js';

const PasswordSchema = z.string().min(8).max(128);

export const IdParamSchema = z.object({
  id: UuidSchema,
});
export type IdParam = z.infer<typeof IdParamSchema>;

export const LoginRequestSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: PasswordSchema,
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: EmailSchema,
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: PasswordSchema,
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

const CreateProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  secondName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  secondLastName: z.string().max(100).optional(),
  nationalId: z.string().min(1).max(20),
  phone: z.string().max(20).optional(),
  avatarUrl: z.url().max(500).optional(),
  employeeCode: z.string().max(20).optional(),
  address: z.string().optional(),
});

const UpdateProfileSchema = CreateProfileSchema.partial();

export const CreateUserRequestSchema = z.object({
  username: z.string().min(1).max(50),
  email: EmailSchema,
  password: PasswordSchema,
  isActive: z.boolean().default(true),
  profile: CreateProfileSchema,
  roleIds: z.array(UuidSchema).min(1),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  email: EmailSchema.optional(),
  isActive: z.boolean().optional(),
  profile: UpdateProfileSchema.optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const AssignUserRolesRequestSchema = z.object({
  roleIds: z.array(UuidSchema).min(1),
});
export type AssignUserRolesRequest = z.infer<typeof AssignUserRolesRequestSchema>;

export const ListUsersQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;

export const CreateRoleRequestSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
});
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;

export const UpdateRoleRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;

export const AssignRolePermissionsRequestSchema = z.object({
  permissions: z.array(
    z.object({
      permissionId: UuidSchema,
      isGranted: z.boolean(),
    })
  ).min(1),
});
export type AssignRolePermissionsRequest = z.infer<typeof AssignRolePermissionsRequestSchema>;

export const CreateModuleRequestSchema = z.object({
  parentId: UuidSchema.optional(),
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateModuleRequest = z.infer<typeof CreateModuleRequestSchema>;

export const UpdateModuleRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateModuleRequest = z.infer<typeof UpdateModuleRequestSchema>;

export const CreatePermissionRequestSchema = z.object({
  moduleId: UuidSchema,
  code: z.string().min(1).max(150),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  type: PermissionTypeSchema,
  isActive: z.boolean().default(true),
});
export type CreatePermissionRequest = z.infer<typeof CreatePermissionRequestSchema>;

export const UpdatePermissionRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  type: PermissionTypeSchema.optional(),
  isActive: z.boolean().optional(),
});
export type UpdatePermissionRequest = z.infer<typeof UpdatePermissionRequestSchema>;
