import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  secondName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  secondLastName: z.string().max(100).optional(),
  nationalId: z.string().min(1).max(20).optional(),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  address: z.string().optional(),
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const AssignAdvisorSupervisorsRequestSchema = z.object({
  supervisorIds: z.array(UuidSchema).min(1),
});
export type AssignAdvisorSupervisorsRequest = z.infer<typeof AssignAdvisorSupervisorsRequestSchema>;

export const ListAdvisorSupervisorsQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
});
export type ListAdvisorSupervisorsQuery = z.infer<typeof ListAdvisorSupervisorsQuerySchema>;

// --- Route params ---

export const UserIdParamSchema = z.object({
  userId: UuidSchema,
});
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

// --- Department management ---

export const CreateDepartmentRequestSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  isActive: z.boolean().default(true),
});
export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequestSchema>;

export const UpdateDepartmentRequestSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentRequestSchema>;

export const ListDepartmentsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListDepartmentsQuery = z.infer<typeof ListDepartmentsQuerySchema>;

// --- Org role management ---

export const CreateOrgRoleRequestSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  departmentId: UuidSchema.optional(),
  isActive: z.boolean().default(true),
});
export type CreateOrgRoleRequest = z.infer<typeof CreateOrgRoleRequestSchema>;

export const UpdateOrgRoleRequestSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  departmentId: UuidSchema.nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateOrgRoleRequest = z.infer<typeof UpdateOrgRoleRequestSchema>;

export const ListOrgRolesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  departmentId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListOrgRolesQuery = z.infer<typeof ListOrgRolesQuerySchema>;

// --- Employee management ---

export const CreateEmployeeRequestSchema = z.object({
  userId: UuidSchema,
  orgRoleId: UuidSchema,
  territory: z.string().max(100).optional(),
  hiredAt: z.string().date().optional(),
  isActive: z.boolean().default(true),
});
export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequestSchema>;

export const UpdateEmployeeRequestSchema = z.object({
  orgRoleId: UuidSchema.optional(),
  territory: z.string().max(100).nullable().optional(),
  hiredAt: z.string().date().nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeRequestSchema>;

export const ListEmployeesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  orgRoleId: UuidSchema.optional(),
  departmentId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListEmployeesQuery = z.infer<typeof ListEmployeesQuerySchema>;
