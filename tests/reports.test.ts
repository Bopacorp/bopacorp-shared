import { describe, expect, it } from 'vitest';
import * as Reports from '../src/reports/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const user = {
  id: uuid,
  username: 'ana.perez',
  email: 'ana@example.com',
  profile: { firstName: 'Ana', lastName: 'Perez' },
};

describe('report contracts', () => {
  it('accepts report and tier enum values and rejects unknown values', () => {
    for (const value of ['COMMERCIAL_PERFORMANCE', 'OPERATIONAL', 'ADVISOR_DASHBOARD']) {
      expect(Reports.ReportTypeSchema.safeParse(value).success).toBe(true);
    }
    for (const value of ['ONE_SHOT', 'MEDIANO', 'SMALL']) {
      expect(Reports.TierCodeSchema.safeParse(value).success).toBe(true);
    }
    expect(Reports.ReportTypeSchema.safeParse('SALES').success).toBe(false);
    expect(Reports.TierCodeSchema.safeParse('LARGE').success).toBe(false);
  });

  it('validates sales target updates and nullable billing limits', () => {
    expect(
      Reports.UpdateSalesTargetRequestSchema.parse({ tierLabel: 'One shot', maxBilling: null, minCloses: 0 })
    ).toEqual({ tierLabel: 'One shot', maxBilling: null, minCloses: 0 });
    expect(Reports.UpdateSalesTargetRequestSchema.safeParse({ minBilling: -1 }).success).toBe(false);
    expect(Reports.UpdateSalesTargetRequestSchema.safeParse({ minCloses: 1.5 }).success).toBe(false);
  });

  it('validates export metadata and its declared file boundaries', () => {
    const request = {
      generatedBy: uuid,
      reportType: 'OPERATIONAL',
      title: 'Operational report',
      filename: 'operational.csv',
      fileExtension: 'csv',
      storagePath: 'reports/operational.csv',
      mimeType: 'text/csv',
    };

    expect(Reports.CreateReportExportRequestSchema.safeParse({ ...request, fileSizeMb: 0.01 }).success).toBe(true);
    expect(Reports.CreateReportExportRequestSchema.safeParse({ ...request, fileSizeMb: 50 }).success).toBe(true);
    expect(Reports.CreateReportExportRequestSchema.safeParse({ ...request, fileSizeMb: 0 }).success).toBe(false);
    expect(Reports.CreateReportExportRequestSchema.safeParse({ ...request, fileSizeMb: 50.01 }).success).toBe(false);
    expect(Reports.CreateReportExportRequestSchema.safeParse({ ...request, reportType: 'UNKNOWN' }).success).toBe(false);
    expect(Reports.ListReportExportsQuerySchema.parse({ reportType: 'ADVISOR_DASHBOARD', generatedBy: uuid })).toMatchObject({
      reportType: 'ADVISOR_DASHBOARD',
      generatedBy: uuid,
    });
  });

  it('validates metric, performance and recent-activity filters', () => {
    expect(
      Reports.ListAdvisorMetricsQuerySchema.parse({
        advisorId: uuid,
        supervisorId: secondUuid,
        dateFrom: '2026-08-01',
        dateTo: '2026-08-31',
      })
    ).toMatchObject({ advisorId: uuid, supervisorId: secondUuid });
    expect(Reports.ListRecentActivityQuerySchema.parse({ advisorId: uuid, dateFrom: '2026-08-01' })).toMatchObject({
      advisorId: uuid,
      dateFrom: '2026-08-01',
    });
    expect(Reports.ListAdvisorPerformanceQuerySchema.safeParse({ dateFrom: '01-08-2026' }).success).toBe(false);
  });

  it('validates report responses and nullable metric values', () => {
    expect(
      Reports.SalesTargetResponseSchema.safeParse({
        id: uuid,
        tierCode: 'ONE_SHOT',
        tierLabel: 'One shot',
        minBilling: 0,
        maxBilling: null,
        minCloses: 0,
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Reports.AdvisorPerformanceResponseSchema.safeParse({
        advisor: user,
        tiers: [{ tierCode: 'ONE_SHOT', tierLabel: 'One shot', closedCount: 2, minCloses: 2, met: true }],
        totalClosed: 2,
        totalRequired: 2,
        overallMet: true,
      }).success
    ).toBe(true);
    expect(
      Reports.AdvisorMetricResponseSchema.safeParse({
        advisor: { id: uuid, username: 'ana.perez', profile: null },
        stateCounts: [{ stateId: secondUuid, stateCode: 'PROSPECT', stateName: 'Prospect', count: 0 }],
        clientsVisited: 0,
        totalBilledAmount: 0,
        averageBillingPerService: 0,
        avgDaysToClose: null,
      }).success
    ).toBe(true);
    expect(
      Reports.RecentActivityResponseSchema.safeParse({
        type: 'visit',
        advisorName: 'Ana Perez',
        clientName: 'Acme',
        description: 'Visited client',
        createdAt: '2026-08-15T12:00:00.000Z',
      }).success
    ).toBe(true);
    expect(
      Reports.ReportExportResponseSchema.safeParse({
        id: uuid,
        reportType: 'OPERATIONAL',
        title: 'Operational report',
        filename: 'operational.csv',
        fileExtension: 'csv',
        fileSizeMb: 1,
        storagePath: 'reports/operational.csv',
        mimeType: 'text/csv',
        generatedAt: '2026-08-15T12:00:00.000Z',
        createdBy: user,
        ...timestamps,
      }).success
    ).toBe(true);
  });

  it('keeps report export list responses slim', () => {
    const result = Reports.ReportExportListItemResponseSchema.safeParse({
      id: uuid,
      reportType: 'OPERATIONAL',
      title: 'Operational report',
      filename: 'operational.csv',
      fileExtension: 'csv',
      fileSizeMb: 1,
      generatedAt: '2026-08-15T12:00:00.000Z',
      createdBy: { id: uuid, username: 'ana.perez' },
      ...timestamps,
      storagePath: 'reports/operational.csv',
      mimeType: 'text/csv',
      email: 'ana@example.com',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('storagePath' in result.data).toBe(false);
      expect('mimeType' in result.data).toBe(false);
      expect('email' in result.data.createdBy).toBe(false);
    }
  });
});
