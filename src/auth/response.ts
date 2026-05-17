import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { PermissionTypeSchema } from './enums.js';

import { ProfileResponseSchema } from '../core/response.js';

export { ProfileResponseSchema, type ProfileResponse } from '../core/response.js';

// --- Auth responses ---

export const AuthTokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});
export type AuthTokensResponse = z.infer<typeof AuthTokensResponseSchema>;

export const LoginResponseSchema = z.object({
  user: z.object({
    id: UuidSchema,
    username: z.string(),
    email: z.string(),
    roles: z.array(z.string()),
    permissions: z.array(z.string()),
    profile: ProfileResponseSchema,
  }),
  tokens: AuthTokensResponseSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// --- Permission response ---

export const PermissionResponseSchema = z
  .object({
    id: UuidSchema,
    moduleId: UuidSchema,
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    type: PermissionTypeSchema,
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type PermissionResponse = z.infer<typeof PermissionResponseSchema>;

// --- Role response ---

export const RoleResponseSchema = z
  .object({
    id: UuidSchema,
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type RoleResponse = z.infer<typeof RoleResponseSchema>;

export const RoleDetailResponseSchema = RoleResponseSchema.extend({
  permissions: z.array(
    z.object({
      id: UuidSchema,
      code: z.string(),
      name: z.string(),
      type: PermissionTypeSchema,
      isGranted: z.boolean(),
    })
  ),
});
export type RoleDetailResponse = z.infer<typeof RoleDetailResponseSchema>;

// --- Module response ---

export const ModuleResponseSchema = z
  .object({
    id: UuidSchema,
    parentId: UuidSchema.nullable(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type ModuleResponse = z.infer<typeof ModuleResponseSchema>;

interface ModuleTree extends z.infer<typeof ModuleResponseSchema> {
  children: ModuleTree[];
}

export const ModuleTreeResponseSchema: z.ZodType<ModuleTree> = ModuleResponseSchema.extend({
  children: z.lazy(() => z.array(ModuleTreeResponseSchema)),
});
export type ModuleTreeResponse = z.infer<typeof ModuleTreeResponseSchema>;

// --- User response ---

export const UserResponseSchema = z
  .object({
    id: UuidSchema,
    username: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    lastLoginAt: z.string().datetime().nullable(),
    profile: ProfileResponseSchema.nullable(),
    roles: z.array(
      z.object({
        id: UuidSchema,
        name: z.string(),
        slug: z.string(),
      })
    ),
  })
  .merge(TimestampsSchema);
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UserListItemResponseSchema = z
  .object({
    id: UuidSchema,
    username: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    lastLoginAt: z.string().datetime().nullable(),
    profile: z
      .object({
        firstName: z.string(),
        lastName: z.string(),
        avatarUrl: z.string().nullable(),
        employeeCode: z.string().nullable(),
      })
      .nullable(),
    roles: z.array(z.string()),
  })
  .merge(TimestampsSchema);
export type UserListItemResponse = z.infer<typeof UserListItemResponseSchema>;

// --- Message response ---

export const MessageResponseSchema = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
