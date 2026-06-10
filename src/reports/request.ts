import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { ReportTypeSchema } from './enums.js';

// --- Sales Objectives ---

export const CreateSalesObjectiveRequestSchema = z.object({
  createdBy: UuidSchema,
  advisorId: UuidSchema.optional(),
  targetSalesAmount: z.number().min(0),
  targetClosedDeals: z.number().int().min(0),
  periodStart: z.string().date(),
  periodEnd: z.string().date(),
});
export type CreateSalesObjectiveRequest = z.infer<typeof CreateSalesObjectiveRequestSchema>;

export const UpdateSalesObjectiveRequestSchema = CreateSalesObjectiveRequestSchema.partial();
export type UpdateSalesObjectiveRequest = z.infer<typeof UpdateSalesObjectiveRequestSchema>;

export const ListSalesObjectivesQuerySchema = PaginationQuerySchema.extend({
  createdBy: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  periodStart: z.string().date().optional(),
  periodEnd: z.string().date().optional(),
});
export type ListSalesObjectivesQuery = z.infer<typeof ListSalesObjectivesQuerySchema>;

// --- Report Exports ---

export const CreateReportExportRequestSchema = z.object({
  generatedBy: UuidSchema,
  reportType: ReportTypeSchema,
  title: z.string().max(255),
  filename: z.string().max(255),
  fileExtension: z.string().max(10),
  fileSizeMb: z.number().min(0.01).max(50),
  storagePath: z.string().max(500),
  mimeType: z.string().max(100),
  generatedAt: z.string().datetime().optional(),
});
export type CreateReportExportRequest = z.infer<typeof CreateReportExportRequestSchema>;

export const ListReportExportsQuerySchema = PaginationQuerySchema.extend({
  reportType: ReportTypeSchema.optional(),
  generatedBy: UuidSchema.optional(),
});
export type ListReportExportsQuery = z.infer<typeof ListReportExportsQuerySchema>;
