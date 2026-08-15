import { describe, expect, it } from 'vitest';
import {
  AdvisorSupervisorResponseSchema,
  DepartmentListItemResponseSchema,
  DepartmentResponseSchema,
  EmployeeListItemResponseSchema,
  EmployeeResponseSchema,
  OrgRoleListItemResponseSchema,
  OrgRoleResponseSchema,
  ProfileResponseSchema,
} from '../../src/core/index.js';

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
const department = {
  id: uuid,
  code: 'SALES',
  name: 'Sales',
  isActive: true,
  ...timestamps,
};
const employeeRef = {
  id: uuid,
  username: 'ana.perez',
  email: 'ana@bopacorp.com',
  profile: { firstName: 'Ana', lastName: 'Perez' },
  orgRole: { id: secondUuid, name: 'Advisor' },
};
const employee = {
  userId: uuid,
  user: {
    id: uuid,
    username: 'ana.perez',
    email: 'ana@bopacorp.com',
    profile: { firstName: 'Ana', lastName: 'Perez', avatarUrl: null },
  },
  orgRole: {
    id: secondUuid,
    code: 'ADVISOR',
    name: 'Advisor',
    department: { id: uuid, code: 'SALES', name: 'Sales' },
  },
  territory: null,
  hiredAt: '2026-08-15',
  isActive: true,
  deletedAt: null,
  supervisors: [],
  advisors: [],
  ...timestamps,
};

describe('core responses', () => {
  it('validates profiles and nullable organization relationships', () => {
    expect(ProfileResponseSchema.safeParse(profile).success).toBe(true);
    expect(ProfileResponseSchema.safeParse({ ...profile, phone: 123 }).success).toBe(false);
    expect(DepartmentResponseSchema.safeParse(department).success).toBe(true);
    expect(DepartmentListItemResponseSchema.safeParse(department).success).toBe(true);
    expect(
      OrgRoleResponseSchema.safeParse({
        id: secondUuid,
        code: 'ADVISOR',
        name: 'Advisor',
        department: null,
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      OrgRoleListItemResponseSchema.safeParse({
        id: secondUuid,
        code: 'ADVISOR',
        name: 'Advisor',
        department: { id: uuid, name: 'Sales' },
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
  });

  it('validates advisor-supervisor nested references', () => {
    expect(
      AdvisorSupervisorResponseSchema.safeParse({
        advisorId: uuid,
        supervisorId: secondUuid,
        isActive: true,
        assignedAt: '2026-08-15T12:00:00.000Z',
        advisor: employeeRef,
        supervisor: { ...employeeRef, id: secondUuid },
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      AdvisorSupervisorResponseSchema.safeParse({
        advisorId: 'bad',
        supervisorId: secondUuid,
        isActive: true,
        assignedAt: '2026-08-15T12:00:00.000Z',
        advisor: employeeRef,
        supervisor: { ...employeeRef, id: secondUuid },
        ...timestamps,
      }).success
    ).toBe(false);
  });

  it('validates complete and list employee responses', () => {
    expect(EmployeeResponseSchema.safeParse(employee).success).toBe(true);
    expect(
      EmployeeListItemResponseSchema.safeParse({
        userId: uuid,
        user: {
          id: uuid,
          username: 'ana.perez',
          email: 'ana@bopacorp.com',
          firstName: 'Ana',
          lastName: 'Perez',
        },
        orgRole: { id: secondUuid, name: 'Advisor' },
        territory: null,
        hiredAt: null,
        isActive: true,
        isLocked: false,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(EmployeeResponseSchema.safeParse({ ...employee, supervisors: [{ userId: 'bad' }] }).success).toBe(false);
    expect(EmployeeListItemResponseSchema.safeParse({ ...employee, userId: 'bad' }).success).toBe(false);
  });

  it('strips backend-only fields from list responses', () => {
    const result = EmployeeListItemResponseSchema.safeParse({
      userId: uuid,
      user: {
        id: uuid,
        username: 'ana.perez',
        email: 'ana@bopacorp.com',
        firstName: 'Ana',
        lastName: 'Perez',
      },
      orgRole: { id: secondUuid, name: 'Advisor' },
      territory: null,
      hiredAt: null,
      isActive: true,
      ...timestamps,
      password_hash: 'not-a-password',
      deleted_at: null,
      ip_address: '127.0.0.1',
      user_agent: 'test-agent',
      old_data: {},
      new_data: {},
    });

    expect(result.success).toBe(true);
    if (result.success) {
      for (const field of ['password_hash', 'deleted_at', 'ip_address', 'user_agent', 'old_data', 'new_data']) {
        expect(field in result.data).toBe(false);
      }
    }
  });

  it('keeps the current EmployeeResponse deletedAt exception explicit', () => {
    const result = EmployeeResponseSchema.safeParse(employee);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deletedAt).toBeNull();
    }
  });
});
