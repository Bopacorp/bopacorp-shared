import { z } from 'zod';
import {
  BooleanQuerySchema,
  EcuadorianIdSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';

export const UpdateProfileRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El primer nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .optional(),
  secondName: z.string().max(50, 'Máximo 50 caracteres').optional(),
  lastName: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .max(50, 'Máximo 50 caracteres')
    .optional(),
  secondLastName: z.string().max(50, 'Máximo 50 caracteres').optional(),
  nationalId: EcuadorianIdSchema.optional(),
  phone: PhoneSchema.optional(),
  avatarUrl: z
    .string()
    .url('La URL no es válida')
    .max(500, 'La URL no puede exceder 500 caracteres')
    .optional(),
  address: z.string().max(255, 'La dirección no puede exceder 255 caracteres').optional(),
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const AssignAdvisorSupervisorsRequestSchema = z.object({
  supervisorIds: z.array(UuidSchema).min(1, 'Debe seleccionar al menos un supervisor'),
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
  code: z.string().min(1, 'El código es obligatorio').max(50, 'Máximo 50 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  isActive: z.boolean().default(true),
});
export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequestSchema>;

export const UpdateDepartmentRequestSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
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
  code: z.string().min(1, 'El código es obligatorio').max(50, 'Máximo 50 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  departmentId: UuidSchema.optional(),
  isActive: z.boolean().default(true),
});
export type CreateOrgRoleRequest = z.infer<typeof CreateOrgRoleRequestSchema>;

export const UpdateOrgRoleRequestSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
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
  territory: z.string().max(100, 'Máximo 100 caracteres').optional(),
  hiredAt: z.string().date('La fecha de contratación no es válida').optional(),
  isActive: z.boolean().default(true),
});
export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequestSchema>;

export const UpdateEmployeeRequestSchema = z.object({
  orgRoleId: UuidSchema.optional(),
  territory: z.string().max(100, 'Máximo 100 caracteres').nullable().optional(),
  hiredAt: z.string().date('La fecha de contratación no es válida').nullable().optional(),
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
