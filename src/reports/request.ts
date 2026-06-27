import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { ReportTypeSchema } from './enums.js';

// --- Sales Targets ---

export const UpdateSalesTargetRequestSchema = z.object({
  tierLabel: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  minBilling: z.number().min(0, V.NON_NEGATIVE).optional(),
  maxBilling: z.number().min(0, V.NON_NEGATIVE).nullable().optional(),
  minCloses: z.number({ error: V.REQUIRED }).int(V.INTEGER).min(0, V.NON_NEGATIVE).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateSalesTargetRequest = z.infer<typeof UpdateSalesTargetRequestSchema>;

// --- Report Exports ---

export const CreateReportExportRequestSchema = z.object({
  generatedBy: UuidSchema,
  reportType: ReportTypeSchema,
  title: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(255, vk(V.MAX_CHARS, { max: 255 })),
  filename: z
    .string({ error: V.REQUIRED })
    .min(1, V.REQUIRED)
    .max(255, vk(V.MAX_CHARS, { max: 255 })),
  fileExtension: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(10, vk(V.MAX_CHARS, { max: 10 })),
  fileSizeMb: z
    .number()
    .min(0.01, vk(V.FILE_MIN_SIZE, { min: 0.01 }))
    .max(50, vk(V.FILE_MAX_SIZE, { max: 50 })),
  storagePath: z
    .string({ error: V.REQUIRED })
    .min(1, V.REQUIRED)
    .max(500, vk(V.MAX_CHARS, { max: 500 })),
  mimeType: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  generatedAt: z.string().datetime(V.DATETIME_INVALID).optional(),
});
export type CreateReportExportRequest = z.infer<typeof CreateReportExportRequestSchema>;

export const ListReportExportsQuerySchema = PaginationQuerySchema.extend({
  reportType: ReportTypeSchema.optional(),
  generatedBy: UuidSchema.optional(),
});
export type ListReportExportsQuery = z.infer<typeof ListReportExportsQuerySchema>;

// --- Advisor Metrics ---

export const ListAdvisorMetricsQuerySchema = z.object({
  advisorId: UuidSchema.optional(),
  supervisorId: UuidSchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type ListAdvisorMetricsQuery = z.infer<typeof ListAdvisorMetricsQuerySchema>;

// --- Recent Activity ---

export const ListRecentActivityQuerySchema = PaginationQuerySchema.extend({
  advisorId: UuidSchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type ListRecentActivityQuery = z.infer<typeof ListRecentActivityQuerySchema>;

// --- Advisor Performance ---

export const ListAdvisorPerformanceQuerySchema = z.object({
  supervisorId: UuidSchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type ListAdvisorPerformanceQuery = z.infer<typeof ListAdvisorPerformanceQuerySchema>;
