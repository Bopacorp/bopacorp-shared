import { z } from 'zod';
import {
  BooleanQuerySchema,
  EcuadorianIdSchema,
  EmailSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';
import { PermissionTypeSchema } from './enums.js';

const PasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña no puede exceder 128 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe tener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'La contraseña debe tener al menos un carácter especial');

// --- Route params ---

export const IdParamSchema = z.object({
  id: UuidSchema,
});
export type IdParam = z.infer<typeof IdParamSchema>;

// --- Auth operations ---

export const LoginRequestSchema = z.object({
  email: EmailSchema.transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LogoutRequestSchema = z.object({
  refreshToken: z.string().min(1, 'El token de refresco es obligatorio'),
});
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'El token de refresco es obligatorio'),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
  newPassword: PasswordSchema,
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: EmailSchema.transform((v) => v.toLowerCase().trim()),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'El token es obligatorio'),
  newPassword: PasswordSchema,
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// --- Profile (nested in user creation/update) ---

const CreateProfileSchema = z.object({
  firstName: z.string().min(1, 'El primer nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  secondName: z.string().max(50, 'Máximo 50 caracteres').optional(),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(50, 'Máximo 50 caracteres'),
  secondLastName: z.string().max(50, 'Máximo 50 caracteres').optional(),
  nationalId: EcuadorianIdSchema,
  phone: PhoneSchema.optional(),
  avatarUrl: z
    .string()
    .url('La URL no es válida')
    .max(500, 'La URL no puede exceder 500 caracteres')
    .optional(),
  address: z.string().max(255, 'La dirección no puede exceder 255 caracteres').optional(),
});

const UpdateProfileSchema = CreateProfileSchema.partial();

// --- User management ---

export const CreateUserRequestSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  email: EmailSchema,
  password: PasswordSchema,
  isActive: z.boolean().default(true),
  profile: CreateProfileSchema,
  roleIds: z.array(UuidSchema).min(1, 'Debe asignar al menos un rol'),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  email: EmailSchema.optional(),
  isActive: z.boolean().optional(),
  profile: UpdateProfileSchema.optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const AssignUserRolesRequestSchema = z.object({
  roleIds: z.array(UuidSchema).min(1, 'Debe seleccionar al menos un rol'),
});
export type AssignUserRolesRequest = z.infer<typeof AssignUserRolesRequestSchema>;

export const ListUsersQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;

// --- Role management ---

export const CreateRoleRequestSchema = z.object({
  name: z.string().min(1, 'El nombre del rol es obligatorio').max(50, 'Máximo 50 caracteres'),
  slug: z.string().min(1, 'El slug es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isActive: z.boolean().default(true),
});
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;

export const UpdateRoleRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del rol es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .optional(),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
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
    .min(1, 'Debe asignar al menos un permiso'),
});
export type AssignRolePermissionsRequest = z.infer<typeof AssignRolePermissionsRequestSchema>;

// --- Module management ---

export const CreateModuleRequestSchema = z.object({
  parentId: UuidSchema.optional(),
  name: z.string().min(1, 'El nombre del módulo es obligatorio').max(50, 'Máximo 50 caracteres'),
  code: z.string().min(1, 'El código es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateModuleRequest = z.infer<typeof CreateModuleRequestSchema>;

export const UpdateModuleRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z
    .string()
    .min(1, 'El nombre del módulo es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .optional(),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateModuleRequest = z.infer<typeof UpdateModuleRequestSchema>;

// --- Permission management ---

export const CreatePermissionRequestSchema = z.object({
  moduleId: UuidSchema,
  code: z.string().min(1, 'El código es obligatorio').max(150, 'Máximo 150 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  type: PermissionTypeSchema,
  isActive: z.boolean().default(true),
});
export type CreatePermissionRequest = z.infer<typeof CreatePermissionRequestSchema>;

export const UpdatePermissionRequestSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
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
