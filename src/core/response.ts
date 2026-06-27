import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';

export const ProfileResponseSchema = z.object({
  id: UuidSchema,
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  secondLastName: z.string().nullable(),
  nationalId: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  address: z.string().nullable(),
});
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

// --- Advisor-Supervisor ---

const AdvisorSupervisorEmployeeRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
  orgRole: z.object({
    id: UuidSchema,
    name: z.string(),
  }),
});

export const AdvisorSupervisorResponseSchema = z
  .object({
    advisorId: UuidSchema,
    supervisorId: UuidSchema,
    isActive: z.boolean(),
    assignedAt: z.string().datetime(),
    advisor: AdvisorSupervisorEmployeeRefSchema,
    supervisor: AdvisorSupervisorEmployeeRefSchema,
  })
  .merge(TimestampsSchema);
export type AdvisorSupervisorResponse = z.infer<typeof AdvisorSupervisorResponseSchema>;

// --- Departments ---

export const DepartmentResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type DepartmentResponse = z.infer<typeof DepartmentResponseSchema>;

export const DepartmentListItemResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type DepartmentListItemResponse = z.infer<typeof DepartmentListItemResponseSchema>;

// --- Org Roles ---

const OrgRoleDepartmentRefSchema = z.object({
  id: UuidSchema,
  code: z.string(),
  name: z.string(),
});

export const OrgRoleResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    department: OrgRoleDepartmentRefSchema.nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type OrgRoleResponse = z.infer<typeof OrgRoleResponseSchema>;

export const OrgRoleListItemResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    department: z
      .object({
        id: UuidSchema,
        name: z.string(),
      })
      .nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type OrgRoleListItemResponse = z.infer<typeof OrgRoleListItemResponseSchema>;

// --- Employees ---

const EmployeeUserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
});

const EmployeeOrgRoleRefSchema = z.object({
  id: UuidSchema,
  code: z.string(),
  name: z.string(),
  department: OrgRoleDepartmentRefSchema.nullable(),
});

const EmployeeRelationRefSchema = z.object({
  userId: UuidSchema,
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const EmployeeResponseSchema = z
  .object({
    userId: UuidSchema,
    user: EmployeeUserRefSchema,
    orgRole: EmployeeOrgRoleRefSchema,
    territory: z.string().nullable(),
    hiredAt: z.string().nullable(),
    isActive: z.boolean(),
    deletedAt: z.string().datetime().nullable(),
    supervisors: z.array(EmployeeRelationRefSchema),
    advisors: z.array(EmployeeRelationRefSchema),
  })
  .merge(TimestampsSchema);
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;

const EmployeeListUserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export const EmployeeListItemResponseSchema = z
  .object({
    userId: UuidSchema,
    user: EmployeeListUserRefSchema,
    orgRole: z.object({
      id: UuidSchema,
      name: z.string(),
    }),
    territory: z.string().nullable(),
    hiredAt: z.string().nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type EmployeeListItemResponse = z.infer<typeof EmployeeListItemResponseSchema>;
