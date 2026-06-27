import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import {
  BooleanQuerySchema,
  EcuadorianIdSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';

export const UpdateProfileRequestSchema = z.object({
  firstName: z
    .string({ error: V.REQUIRED })
    .min(1, V.REQUIRED)
    .max(50, vk(V.MAX_CHARS, { max: 50 }))
    .optional(),
  secondName: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  lastName: z
    .string({ error: V.REQUIRED })
    .min(1, V.REQUIRED)
    .max(50, vk(V.MAX_CHARS, { max: 50 }))
    .optional(),
  secondLastName: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  nationalId: EcuadorianIdSchema.optional(),
  phone: PhoneSchema.optional(),
  avatarUrl: z
    .string()
    .url(V.URL_INVALID)
    .max(500, vk(V.URL_MAX, { max: 500 }))
    .optional(),
  address: z.string().max(255, vk(V.ADDRESS_MAX, { max: 255 })).optional(),
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const AssignAdvisorSupervisorsRequestSchema = z.object({
  supervisorIds: z.array(UuidSchema).min(1, vk(V.MIN_ITEMS, { min: 1 })),
});
export type AssignAdvisorSupervisorsRequest = z.infer<typeof AssignAdvisorSupervisorsRequestSchema>;

export const ListAdvisorSupervisorsQuerySchema = PaginationQuerySchema.extend({
  isActive: BooleanQuerySchema.optional(),
});
export type ListAdvisorSupervisorsQuery = z.infer<typeof ListAdvisorSupervisorsQuerySchema>;

// --- Route params ---

export const UserIdParamSchema = z.object({
  userId: UuidSchema,
});
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

// --- Department management ---

export const CreateDepartmentRequestSchema = z.object({
  code: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  name: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  isActive: z.boolean().default(true),
});
export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequestSchema>;

export const UpdateDepartmentRequestSchema = z.object({
  code: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  name: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentRequestSchema>;

export const ListDepartmentsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListDepartmentsQuery = z.infer<typeof ListDepartmentsQuerySchema>;

// --- Org role management ---

export const CreateOrgRoleRequestSchema = z.object({
  code: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  name: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  departmentId: UuidSchema.optional(),
  isActive: z.boolean().default(true),
});
export type CreateOrgRoleRequest = z.infer<typeof CreateOrgRoleRequestSchema>;

export const UpdateOrgRoleRequestSchema = z.object({
  code: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  name: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  departmentId: UuidSchema.nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateOrgRoleRequest = z.infer<typeof UpdateOrgRoleRequestSchema>;

export const ListOrgRolesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  departmentId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListOrgRolesQuery = z.infer<typeof ListOrgRolesQuerySchema>;

// --- Employee management ---

export const CreateEmployeeRequestSchema = z.object({
  userId: UuidSchema,
  orgRoleId: UuidSchema,
  territory: z.string().max(100, vk(V.MAX_CHARS, { max: 100 })).optional(),
  hiredAt: z.string().date(V.DATE_INVALID).optional(),
  isActive: z.boolean().default(true),
});
export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequestSchema>;

export const UpdateEmployeeRequestSchema = z.object({
  orgRoleId: UuidSchema.optional(),
  territory: z.string().max(100, vk(V.MAX_CHARS, { max: 100 })).nullable().optional(),
  hiredAt: z.string().date(V.DATE_INVALID).nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeRequestSchema>;

export const ListEmployeesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  orgRoleId: UuidSchema.optional(),
  orgRoleCode: z.string().optional(),
  departmentId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListEmployeesQuery = z.infer<typeof ListEmployeesQuerySchema>;
