import { describe, expect, it } from 'vitest';
import {
  BusinessClientListItemResponseSchema,
  BusinessClientResponseSchema,
  NegotiationListItemResponseSchema,
  NegotiationResponseSchema,
  NegotiationStateHistoryResponseSchema,
  NegotiationStateResponseSchema,
  VisitListItemResponseSchema,
  VisitResponseSchema,
  VisitTypeResponseSchema,
} from '../../src/crm/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const employee = {
  id: secondUuid,
  username: 'ana.perez',
  email: 'ana@bopacorp.com',
  profile: { firstName: 'Ana', lastName: 'Perez' },
};
const slimEmployee = {
  id: secondUuid,
  username: 'ana.perez',
  profile: { firstName: 'Ana', lastName: 'Perez' },
};
const client = {
  id: uuid,
  businessName: 'Acme Corporation',
  contactName: 'Ana Perez',
};
const slimClient = {
  id: uuid,
  businessName: 'Acme Corporation',
};
const state = { id: uuid, code: 'PROSPECT', name: 'Prospect' };
const visitType = { id: secondUuid, code: 'ONSITE', name: 'On site' };

describe('crm responses', () => {
  it('validates lookup responses and required timestamps', () => {
    expect(
      NegotiationStateResponseSchema.safeParse({
        ...state,
        description: null,
        position: 1,
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      VisitTypeResponseSchema.safeParse({
        ...visitType,
        description: 'On-site visit',
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      NegotiationStateResponseSchema.safeParse({
        ...state,
        description: null,
        position: 1,
        isActive: true,
        ...timestamps,
        updatedAt: 'not-a-date',
      }).success
    ).toBe(false);
  });

  it('validates complete and slim business client responses', () => {
    const full = {
      id: uuid,
      ruc: '1234567890123',
      businessName: 'Acme Corporation',
      contactName: 'Ana Perez',
      contactPhone: '0991234567',
      contactEmail: 'ana@example.com',
      address: 'Main street',
      activeServicesCount: 2,
      currentMonthlyBilling: 1250.5,
      isActive: true,
      advisor: employee,
      ...timestamps,
    };

    expect(BusinessClientResponseSchema.safeParse(full).success).toBe(true);
    expect(
      BusinessClientListItemResponseSchema.safeParse({
        id: uuid,
        ruc: '1234567890123',
        businessName: 'Acme Corporation',
        contactName: 'Ana Perez',
        isActive: true,
        advisor: slimEmployee,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(BusinessClientResponseSchema.safeParse({ ...full, activeServicesCount: 1.5 }).success).toBe(false);
  });

  it('validates negotiations, state history and slim references', () => {
    const full = {
      id: uuid,
      startDate: '2026-08-15',
      estimatedCloseDate: null,
      observations: 'Initial opportunity',
      isActive: true,
      client,
      advisor: employee,
      state,
      ...timestamps,
    };

    expect(NegotiationResponseSchema.safeParse(full).success).toBe(true);
    expect(
      NegotiationListItemResponseSchema.safeParse({
        id: uuid,
        startDate: null,
        estimatedCloseDate: '2026-09-15',
        isActive: true,
        client: slimClient,
        advisor: slimEmployee,
        state,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      NegotiationStateHistoryResponseSchema.safeParse({
        id: secondUuid,
        previousState: null,
        newState: state,
        changedBy: slimEmployee,
        notes: null,
        createdAt: '2026-08-15T13:00:00.000Z',
      }).success
    ).toBe(true);
    expect(NegotiationResponseSchema.safeParse({ ...full, startDate: '15-08-2026' }).success).toBe(false);
    expect(NegotiationStateHistoryResponseSchema.safeParse({
      id: secondUuid,
      previousState: null,
      newState: { ...state, id: 'bad' },
      changedBy: slimEmployee,
      notes: null,
      createdAt: '2026-08-15T13:00:00.000Z',
    }).success).toBe(false);
  });

  it('validates visits with nullable GPS and relationship fields', () => {
    const full = {
      id: uuid,
      visitDate: '2026-08-15T12:00:00.000Z',
      observations: null,
      isVerified: false,
      supervisorComment: null,
      gpsLatitude: null,
      gpsLongitude: null,
      gpsAccuracy: null,
      gpsTimestamp: null,
      negotiation: { id: secondUuid, client: slimClient },
      client,
      advisor: employee,
      verifiedBy: null,
      visitType,
      ...timestamps,
    };

    expect(VisitResponseSchema.safeParse(full).success).toBe(true);
    expect(
      VisitListItemResponseSchema.safeParse({
        id: uuid,
        visitDate: '2026-08-15T12:00:00.000Z',
        isVerified: true,
        client: slimClient,
        advisor: slimEmployee,
        visitType,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(VisitResponseSchema.safeParse({ ...full, negotiation: { id: 'bad', client: slimClient } }).success).toBe(false);
    expect(VisitListItemResponseSchema.safeParse({ ...full, visitDate: 'not-a-date' }).success).toBe(false);
  });

  it('keeps list responses slim when extra detail fields are supplied', () => {
    const result = BusinessClientListItemResponseSchema.safeParse({
      id: uuid,
      ruc: '1234567890123',
      businessName: 'Acme Corporation',
      contactName: 'Ana Perez',
      isActive: true,
      advisor: slimEmployee,
      ...timestamps,
      contactEmail: 'ana@example.com',
      address: 'Main street',
      activeServicesCount: 2,
      currentMonthlyBilling: 1250.5,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('contactEmail' in result.data).toBe(false);
      expect('address' in result.data).toBe(false);
      expect('activeServicesCount' in result.data).toBe(false);
      expect('currentMonthlyBilling' in result.data).toBe(false);
    }
  });
});
