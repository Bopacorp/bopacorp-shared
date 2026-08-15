import { describe, expect, it } from 'vitest';
import {
  AssignAdvisorSupervisorsRequestSchema,
  CreateDepartmentRequestSchema,
  CreateEmployeeRequestSchema,
  CreateOrgRoleRequestSchema,
  ListAdvisorSupervisorsQuerySchema,
  ListDepartmentsQuerySchema,
  ListEmployeesQuerySchema,
  ListOrgRolesQuerySchema,
  UpdateDepartmentRequestSchema,
  UpdateEmployeeRequestSchema,
  UpdateOrgRoleRequestSchema,
  UpdateProfileRequestSchema,
  UserIdParamSchema,
} from '../../src/core/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';

describe('core requests', () => {
  it('preserves partial profile updates and validates profile fields', () => {
    expect(UpdateProfileRequestSchema.parse({})).toEqual({});
    expect(
      UpdateProfileRequestSchema.parse({
        firstName: 'Ana',
        avatarUrl: 'https://example.com/avatar.png',
        address: 'Main street',
      })
    ).toEqual({
      firstName: 'Ana',
      avatarUrl: 'https://example.com/avatar.png',
      address: 'Main street',
    });
    expect(UpdateProfileRequestSchema.safeParse({ avatarUrl: 'not-a-url' }).success).toBe(false);
    expect(UpdateProfileRequestSchema.safeParse({ nationalId: 'bad' }).success).toBe(false);
  });

  it('requires at least one supervisor and valid user IDs', () => {
    expect(AssignAdvisorSupervisorsRequestSchema.safeParse({ supervisorIds: [uuid, secondUuid] }).success).toBe(true);
    expect(AssignAdvisorSupervisorsRequestSchema.safeParse({ supervisorIds: [] }).success).toBe(false);
    expect(UserIdParamSchema.safeParse({ userId: uuid }).success).toBe(true);
    expect(UserIdParamSchema.safeParse({ userId: 'bad' }).success).toBe(false);
  });

  it('applies active defaults to departments and organizational roles', () => {
    expect(CreateDepartmentRequestSchema.parse({ code: 'SALES', name: 'Sales' })).toEqual({
      code: 'SALES',
      name: 'Sales',
      isActive: true,
    });
    expect(CreateOrgRoleRequestSchema.parse({ code: 'ADVISOR', name: 'Advisor' })).toEqual({
      code: 'ADVISOR',
      name: 'Advisor',
      isActive: true,
    });
    expect(UpdateDepartmentRequestSchema.parse({ name: 'Updated sales' })).toEqual({ name: 'Updated sales' });
    expect(UpdateOrgRoleRequestSchema.parse({ departmentId: null })).toEqual({ departmentId: null });
  });

  it('validates employee dates, nullable updates and defaults', () => {
    expect(
      CreateEmployeeRequestSchema.parse({ userId: uuid, orgRoleId: secondUuid, hiredAt: '2026-08-15' })
    ).toMatchObject({
      userId: uuid,
      orgRoleId: secondUuid,
      hiredAt: '2026-08-15',
      isActive: true,
    });
    expect(
      UpdateEmployeeRequestSchema.parse({ territory: null, hiredAt: null, isActive: false })
    ).toEqual({ territory: null, hiredAt: null, isActive: false });
    expect(CreateEmployeeRequestSchema.safeParse({ userId: uuid, orgRoleId: secondUuid, hiredAt: '15-08-2026' }).success).toBe(
      false
    );
    expect(UpdateEmployeeRequestSchema.safeParse({ territory: 'x'.repeat(101) }).success).toBe(false);
  });

  it('coerces organization query flags and validates filters', () => {
    expect(ListAdvisorSupervisorsQuerySchema.parse({ isActive: 'true' }).isActive).toBe(true);
    expect(ListDepartmentsQuerySchema.parse({ search: 'sales', isActive: 'false' })).toMatchObject({
      search: 'sales',
      isActive: false,
    });
    expect(ListOrgRolesQuerySchema.parse({ departmentId: uuid }).departmentId).toBe(uuid);
    expect(
      ListEmployeesQuerySchema.parse({
        orgRoleId: secondUuid,
        departmentId: uuid,
        includeLockStatus: 'true',
      })
    ).toMatchObject({
      orgRoleId: secondUuid,
      departmentId: uuid,
      includeLockStatus: true,
    });
    expect(ListEmployeesQuerySchema.safeParse({ orgRoleId: 'bad' }).success).toBe(false);
  });
});
