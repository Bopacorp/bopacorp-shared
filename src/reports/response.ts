import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { ReportTypeSchema } from './enums.js';

// --- Nested references (not exported) ---

const UserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
});

const SlimUserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
});

// --- Sales Targets ---

export const SalesTargetResponseSchema = z
  .object({
    id: UuidSchema,
    tierCode: z.string(),
    tierLabel: z.string(),
    minBilling: z.number(),
    maxBilling: z.number().nullable(),
    minCloses: z.number().int(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type SalesTargetResponse = z.infer<typeof SalesTargetResponseSchema>;

// --- Advisor Performance ---

const AdvisorTierPerformanceSchema = z.object({
  tierCode: z.string(),
  tierLabel: z.string(),
  closedCount: z.number().int(),
  minCloses: z.number().int(),
  met: z.boolean(),
});

export const AdvisorPerformanceResponseSchema = z.object({
  advisor: UserRefSchema,
  tiers: z.array(AdvisorTierPerformanceSchema),
  totalClosed: z.number().int(),
  totalRequired: z.number().int(),
  overallMet: z.boolean(),
});
export type AdvisorPerformanceResponse = z.infer<typeof AdvisorPerformanceResponseSchema>;

// --- Report Exports ---

export const ReportExportResponseSchema = z
  .object({
    id: UuidSchema,
    reportType: ReportTypeSchema,
    title: z.string(),
    filename: z.string(),
    fileExtension: z.string(),
    fileSizeMb: z.number(),
    storagePath: z.string(),
    mimeType: z.string(),
    generatedAt: z.string().datetime(),
    createdBy: UserRefSchema,
  })
  .merge(TimestampsSchema);
export type ReportExportResponse = z.infer<typeof ReportExportResponseSchema>;

export const ReportExportListItemResponseSchema = z
  .object({
    id: UuidSchema,
    reportType: ReportTypeSchema,
    title: z.string(),
    filename: z.string(),
    fileExtension: z.string(),
    fileSizeMb: z.number(),
    generatedAt: z.string().datetime(),
    createdBy: SlimUserRefSchema,
  })
  .merge(TimestampsSchema);
export type ReportExportListItemResponse = z.infer<typeof ReportExportListItemResponseSchema>;

// --- Advisor Metrics ---

const StateCountSchema = z.object({
  stateId: UuidSchema,
  stateCode: z.string(),
  stateName: z.string(),
  count: z.number().int(),
});

export const AdvisorMetricResponseSchema = z.object({
  advisor: z.object({
    id: UuidSchema,
    username: z.string(),
    profile: z
      .object({
        firstName: z.string(),
        lastName: z.string(),
      })
      .nullable(),
  }),
  stateCounts: z.array(StateCountSchema),
  clientsVisited: z.number().int(),
  totalBilledAmount: z.number(),
  averageBillingPerService: z.number(),
  avgDaysToClose: z.number().nullable(),
});
export type AdvisorMetricResponse = z.infer<typeof AdvisorMetricResponseSchema>;

// --- Recent Activity ---

export const RecentActivityResponseSchema = z.object({
  type: z.enum(['state_change', 'visit']),
  advisorName: z.string(),
  clientName: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
});
export type RecentActivityResponse = z.infer<typeof RecentActivityResponseSchema>;
