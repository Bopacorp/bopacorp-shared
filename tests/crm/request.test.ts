import { describe, expect, it } from 'vitest';
import {
  ChangeNegotiationStateRequestSchema,
  CreateBusinessClientRequestSchema,
  CreateNegotiationRequestSchema,
  CreateNegotiationStateRequestSchema,
  CreateVisitRequestSchema,
  CreateVisitTypeRequestSchema,
  ListBusinessClientsQuerySchema,
  ListNegotiationStatesQuerySchema,
  ListNegotiationsQuerySchema,
  ListVisitsQuerySchema,
  ListVisitTypesQuerySchema,
  UpdateBusinessClientRequestSchema,
  UpdateNegotiationRequestSchema,
  UpdateNegotiationStateRequestSchema,
  UpdateVisitRequestSchema,
  UpdateVisitTypeRequestSchema,
  VerifyVisitRequestSchema,
} from '../../src/crm/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const visitDate = '2026-08-15T12:00:00.000Z';

describe('crm requests', () => {
  it('applies defaults and partial semantics to lookup requests', () => {
    expect(CreateNegotiationStateRequestSchema.parse({ code: 'PROSPECT', name: 'Prospect' })).toMatchObject({
      isActive: true,
    });
    expect(UpdateNegotiationStateRequestSchema.parse({})).toEqual({ isActive: true });
    expect(CreateVisitTypeRequestSchema.parse({ code: 'ONSITE', name: 'On site' })).toMatchObject({
      isActive: true,
    });
    expect(UpdateVisitTypeRequestSchema.parse({ description: 'Updated type' })).toEqual({
      description: 'Updated type',
      isActive: true,
    });
    expect(ListNegotiationStatesQuerySchema.parse({ isActive: 'false', search: 'prospect' })).toMatchObject({
      isActive: false,
      search: 'prospect',
    });
    expect(ListVisitTypesQuerySchema.parse({ isActive: 'true' }).isActive).toBe(true);
  });

  it('validates business clients and non-negative commercial values', () => {
    const request = {
      ruc: '1234567890123',
      businessName: 'Acme Corporation',
      contactName: 'Ana Perez',
      contactPhone: '0991234567',
      contactEmail: 'ana@example.com',
      address: 'Main street',
      activeServicesCount: 2,
      currentMonthlyBilling: 1250.5,
    };

    expect(CreateBusinessClientRequestSchema.parse(request)).toMatchObject({ ...request, isActive: true });
    expect(CreateBusinessClientRequestSchema.safeParse({ ...request, ruc: 'bad' }).success).toBe(false);
    expect(CreateBusinessClientRequestSchema.safeParse({ ...request, contactEmail: 'bad' }).success).toBe(false);
    expect(CreateBusinessClientRequestSchema.safeParse({ ...request, activeServicesCount: -1 }).success).toBe(false);
    expect(CreateBusinessClientRequestSchema.safeParse({ ...request, activeServicesCount: 1.5 }).success).toBe(false);
    expect(CreateBusinessClientRequestSchema.safeParse({ ...request, currentMonthlyBilling: -0.01 }).success).toBe(false);
    expect(UpdateBusinessClientRequestSchema.parse({ currentMonthlyBilling: 0 })).toEqual({
      currentMonthlyBilling: 0,
      isActive: true,
    });
    expect(
      ListBusinessClientsQuerySchema.parse({ advisorId: uuid, isActive: 'true', search: 'acme' })
    ).toMatchObject({ advisorId: uuid, isActive: true, search: 'acme' });
  });

  it('validates negotiations, dates, state changes and tier filters', () => {
    const request = {
      clientId: uuid,
      advisorId: secondUuid,
      stateId: uuid,
      startDate: '2026-08-15',
      estimatedCloseDate: '2026-09-15',
      observations: 'Initial commercial opportunity',
    };

    expect(CreateNegotiationRequestSchema.parse(request)).toMatchObject({ ...request, isActive: true });
    expect(UpdateNegotiationRequestSchema.parse({ observations: 'Updated' })).toEqual({
      observations: 'Updated',
      isActive: true,
    });
    expect(
      ChangeNegotiationStateRequestSchema.safeParse({ stateId: secondUuid, notes: 'Moved to proposal' }).success
    ).toBe(true);
    expect(ListNegotiationsQuerySchema.parse({ tierCode: 'ONE_SHOT', stateId: uuid, isActive: 'false' })).toMatchObject({
      tierCode: 'ONE_SHOT',
      stateId: uuid,
      isActive: false,
    });
    expect(CreateNegotiationRequestSchema.safeParse({ ...request, startDate: '15-08-2026' }).success).toBe(false);
    expect(CreateNegotiationRequestSchema.safeParse({ ...request, observations: 'x'.repeat(1001) }).success).toBe(false);
    expect(ListNegotiationsQuerySchema.safeParse({ tierCode: 'UNKNOWN' }).success).toBe(false);
  });

  it('validates visits, GPS metadata and verification defaults', () => {
    const request = {
      negotiationId: uuid,
      clientId: uuid,
      advisorId: secondUuid,
      visitTypeId: secondUuid,
      visitDate,
      observations: 'Visited the client office',
      gpsLatitude: -2.17,
      gpsLongitude: -79.92,
      gpsAccuracy: 8.5,
      gpsTimestamp: visitDate,
    };

    expect(CreateVisitRequestSchema.parse(request)).toEqual(request);
    expect(UpdateVisitRequestSchema.parse({ gpsAccuracy: 5 })).toEqual({ gpsAccuracy: 5 });
    expect(VerifyVisitRequestSchema.parse({})).toEqual({ isVerified: true });
    expect(VerifyVisitRequestSchema.parse({ supervisorComment: 'Reviewed' })).toMatchObject({ isVerified: true });
    expect(CreateVisitRequestSchema.safeParse({ ...request, observations: '' }).success).toBe(false);
    expect(CreateVisitRequestSchema.safeParse({ ...request, visitDate: 'not-a-date' }).success).toBe(false);
    expect(CreateVisitRequestSchema.safeParse({ ...request, gpsLatitude: 'not-a-number' }).success).toBe(false);
    expect(
      ListVisitsQuerySchema.parse({
        clientId: uuid,
        visitTypeId: secondUuid,
        isVerified: 'true',
        dateFrom: '2026-08-01',
        dateTo: '2026-08-31',
      })
    ).toMatchObject({ clientId: uuid, visitTypeId: secondUuid, isVerified: true });
    expect(ListVisitsQuerySchema.safeParse({ dateFrom: '01-08-2026' }).success).toBe(false);
  });
});
