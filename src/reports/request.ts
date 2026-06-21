import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { ReportTypeSchema } from './enums.js';

// --- Sales Objectives ---

export const CreateSalesObjectiveRequestSchema = z.object({
  createdBy: UuidSchema,
  advisorId: UuidSchema.optional(),
  targetSalesAmount: z.number().min(0, 'El monto objetivo no puede ser negativo'),
  targetClosedDeals: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'El número de tratos no puede ser negativo'),
  periodStart: z.string().date('La fecha de inicio no es válida'),
  periodEnd: z.string().date('La fecha de fin no es válida'),
});
export type CreateSalesObjectiveRequest = z.infer<typeof CreateSalesObjectiveRequestSchema>;

export const UpdateSalesObjectiveRequestSchema = CreateSalesObjectiveRequestSchema.partial();
export type UpdateSalesObjectiveRequest = z.infer<typeof UpdateSalesObjectiveRequestSchema>;

export const ListSalesObjectivesQuerySchema = PaginationQuerySchema.extend({
  createdBy: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  periodStart: z.string().date('La fecha de inicio no es válida').optional(),
  periodEnd: z.string().date('La fecha de fin no es válida').optional(),
});
export type ListSalesObjectivesQuery = z.infer<typeof ListSalesObjectivesQuerySchema>;

// --- Report Exports ---

export const CreateReportExportRequestSchema = z.object({
  generatedBy: UuidSchema,
  reportType: ReportTypeSchema,
  title: z.string().min(1, 'El título es obligatorio').max(255, 'Máximo 255 caracteres'),
  filename: z
    .string()
    .min(1, 'El nombre del archivo es obligatorio')
    .max(255, 'Máximo 255 caracteres'),
  fileExtension: z.string().min(1, 'La extensión es obligatoria').max(10, 'Máximo 10 caracteres'),
  fileSizeMb: z
    .number()
    .min(0.01, 'El archivo debe pesar al menos 0.01 MB')
    .max(50, 'El archivo debe pesar menos de 50 MB'),
  storagePath: z
    .string()
    .min(1, 'La ruta de almacenamiento es obligatoria')
    .max(500, 'Máximo 500 caracteres'),
  mimeType: z.string().min(1, 'El tipo MIME es obligatorio').max(100, 'Máximo 100 caracteres'),
  generatedAt: z.string().datetime('La fecha de generación no es válida').optional(),
});
export type CreateReportExportRequest = z.infer<typeof CreateReportExportRequestSchema>;

export const ListReportExportsQuerySchema = PaginationQuerySchema.extend({
  reportType: ReportTypeSchema.optional(),
  generatedBy: UuidSchema.optional(),
});
export type ListReportExportsQuery = z.infer<typeof ListReportExportsQuerySchema>;
