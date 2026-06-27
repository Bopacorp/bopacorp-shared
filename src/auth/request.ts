import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import {
  BooleanQuerySchema,
  CorporateEmailSchema,
  EcuadorianIdSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';
import { PermissionTypeSchema } from './enums.js';

const PasswordSchema = z
  .string()
  .min(8, vk(V.PASSWORD_MIN, { min: 8 }))
  .max(128, vk(V.PASSWORD_MAX, { max: 128 }))
  .regex(/[A-Z]/, V.PASSWORD_UPPERCASE)
  .regex(/[a-z]/, V.PASSWORD_LOWERCASE)
  .regex(/[0-9]/, V.PASSWORD_DIGIT)
  .regex(/[^A-Za-z0-9]/, V.PASSWORD_SPECIAL);

// --- Route params ---

export const IdParamSchema = z.object({
  id: UuidSchema,
});
export type IdParam = z.infer<typeof IdParamSchema>;

// --- Auth operations ---

export const LoginRequestSchema = z.object({
  email: CorporateEmailSchema.transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, V.PASSWORD_REQUIRED),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LogoutRequestSchema = z.object({
  refreshToken: z.string().min(1, V.REQUIRED),
});
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, V.REQUIRED),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, V.REQUIRED),
  newPassword: PasswordSchema,
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: CorporateEmailSchema.transform((v) => v.toLowerCase().trim()),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, V.REQUIRED),
  newPassword: PasswordSchema,
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// --- Profile (nested in user creation/update) ---

const CreateProfileSchema = z.object({
  firstName: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  secondName: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  lastName: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  secondLastName: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  nationalId: EcuadorianIdSchema,
  phone: PhoneSchema.optional(),
  avatarUrl: z
    .string()
    .url(V.URL_INVALID)
    .max(500, vk(V.URL_MAX, { max: 500 }))
    .optional(),
  address: z.string().max(255, vk(V.ADDRESS_MAX, { max: 255 })).optional(),
});

const UpdateProfileSchema = CreateProfileSchema.partial();

// --- User management ---

export const CreateUserRequestSchema = z.object({
  username: z
    .string()
    .min(1, V.REQUIRED)
    .max(50, vk(V.MAX_CHARS, { max: 50 })),
  email: CorporateEmailSchema,
  password: PasswordSchema,
  isActive: z.boolean().default(true),
  profile: CreateProfileSchema,
  roleIds: z.array(UuidSchema).min(1, vk(V.MIN_ITEMS, { min: 1 })),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  email: CorporateEmailSchema.optional(),
  isActive: z.boolean().optional(),
  profile: UpdateProfileSchema.optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const AssignUserRolesRequestSchema = z.object({
  roleIds: z.array(UuidSchema).min(1, vk(V.MIN_ITEMS, { min: 1 })),
});
export type AssignUserRolesRequest = z.infer<typeof AssignUserRolesRequestSchema>;

export const ListUsersQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;

// --- Role management ---

export const CreateRoleRequestSchema = z.object({
  name: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  slug: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  isActive: z.boolean().default(true),
});
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;

export const UpdateRoleRequestSchema = z.object({
  name: z
    .string()
    .min(1, V.REQUIRED)
    .max(50, vk(V.MAX_CHARS, { max: 50 }))
    .optional(),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;

export const AssignRolePermissionsRequestSchema = z.object({
  permissions: z
    .array(
      z.object({
        permissionId: UuidSchema,
        isGranted: z.boolean(),
      })
    )
    .min(1, vk(V.MIN_ITEMS, { min: 1 })),
});
export type AssignRolePermissionsRequest = z.infer<typeof AssignRolePermissionsRequestSchema>;

// --- Module management ---

export const CreateModuleRequestSchema = z.object({
  parentId: UuidSchema.optional(),
  name: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  code: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateModuleRequest = z.infer<typeof CreateModuleRequestSchema>;

export const UpdateModuleRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z
    .string()
    .min(1, V.REQUIRED)
    .max(50, vk(V.MAX_CHARS, { max: 50 }))
    .optional(),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateModuleRequest = z.infer<typeof UpdateModuleRequestSchema>;

// --- Permission management ---

export const CreatePermissionRequestSchema = z.object({
  moduleId: UuidSchema,
  code: z.string().min(1, V.REQUIRED).max(150, vk(V.MAX_CHARS, { max: 150 })),
  name: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  type: PermissionTypeSchema,
  isActive: z.boolean().default(true),
});
export type CreatePermissionRequest = z.infer<typeof CreatePermissionRequestSchema>;

export const UpdatePermissionRequestSchema = z.object({
  name: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  type: PermissionTypeSchema.optional(),
  isActive: z.boolean().optional(),
});
export type UpdatePermissionRequest = z.infer<typeof UpdatePermissionRequestSchema>;

// --- List queries ---

export const ListRolesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListRolesQuery = z.infer<typeof ListRolesQuerySchema>;

export const ListModulesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
  parentId: UuidSchema.optional(),
});
export type ListModulesQuery = z.infer<typeof ListModulesQuerySchema>;

export const ListPermissionsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
  moduleId: UuidSchema.optional(),
  type: PermissionTypeSchema.optional(),
});
export type ListPermissionsQuery = z.infer<typeof ListPermissionsQuerySchema>;
