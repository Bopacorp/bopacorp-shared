import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { AttachmentTypeSchema } from './enums.js';

// --- Offer Matrices ---

export const CreateOfferMatrixRequestSchema = z.object({
  negotiationId: UuidSchema,
  observations: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
});
export type CreateOfferMatrixRequest = z.infer<typeof CreateOfferMatrixRequestSchema>;

export const UpdateOfferMatrixRequestSchema = z
  .object({
    observations: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
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
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  filename: z
    .string()
    .min(1, V.REQUIRED)
    .max(255, vk(V.MAX_CHARS, { max: 255 })),
  fileExtension: z.string().min(1, V.REQUIRED).max(10, vk(V.MAX_CHARS, { max: 10 })),
  fileSizeMb: z
    .number()
    .min(0.01, vk(V.FILE_MIN_SIZE, { min: 0.01 }))
    .max(50, vk(V.FILE_MAX_SIZE, { max: 50 })),
  storagePath: z
    .string()
    .min(1, V.REQUIRED)
    .max(500, vk(V.MAX_CHARS, { max: 500 })),
  mimeType: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  encryptionMetadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateMatrixAttachmentRequest = z.infer<typeof CreateMatrixAttachmentRequestSchema>;

export const ListMatrixAttachmentsQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
});
export type ListMatrixAttachmentsQuery = z.infer<typeof ListMatrixAttachmentsQuerySchema>;
