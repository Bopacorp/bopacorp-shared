import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { AttachmentTypeSchema } from './enums.js';

// --- Offer Matrices ---

export const CreateOfferMatrixRequestSchema = z.object({
  negotiationId: UuidSchema,
  observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
export type CreateOfferMatrixRequest = z.infer<typeof CreateOfferMatrixRequestSchema>;

export const UpdateOfferMatrixRequestSchema = z
  .object({
    observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  })
  .strict();
export type UpdateOfferMatrixRequest = z.infer<typeof UpdateOfferMatrixRequestSchema>;

export const ListOfferMatricesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  negotiationId: UuidSchema.optional(),
});
export type ListOfferMatricesQuery = z.infer<typeof ListOfferMatricesQuerySchema>;

// --- Matrix Attachments ---

export const CreateMatrixAttachmentRequestSchema = z.object({
  matrixId: UuidSchema,
  attachmentType: AttachmentTypeSchema,
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
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
});
export type CreateMatrixAttachmentRequest = z.infer<typeof CreateMatrixAttachmentRequestSchema>;

export const ListMatrixAttachmentsQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
});
export type ListMatrixAttachmentsQuery = z.infer<typeof ListMatrixAttachmentsQuerySchema>;
