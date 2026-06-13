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

const EmployeeRefSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
});

// --- Sales Objectives ---

export const SalesObjectiveResponseSchema = z
  .object({
    id: UuidSchema,
    targetSalesAmount: z.number(),
    targetClosedDeals: z.number(),
    periodStart: z.string().date(),
    periodEnd: z.string().date(),
    createdBy: UserRefSchema,
    advisor: EmployeeRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type SalesObjectiveResponse = z.infer<typeof SalesObjectiveResponseSchema>;

export const SalesObjectiveListItemResponseSchema = z
  .object({
    id: UuidSchema,
    targetSalesAmount: z.number(),
    targetClosedDeals: z.number(),
    periodStart: z.string().date(),
    periodEnd: z.string().date(),
    createdBy: SlimUserRefSchema,
    advisor: SlimUserRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type SalesObjectiveListItemResponse = z.infer<typeof SalesObjectiveListItemResponseSchema>;

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
