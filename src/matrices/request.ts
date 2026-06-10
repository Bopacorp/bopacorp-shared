import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { MatrixStateSchema } from './enums.js';

// --- Offer Matrices ---

export const CreateOfferMatrixRequestSchema = z.object({
  negotiationId: UuidSchema,
  observations: z.string().optional(),
  totalAmount: z.number().min(0).default(0),
  calculatedSubsidy: z.number().min(0).default(0),
  subsidyStrategy: z.string().max(50).default('STANDARD'),
});
export type CreateOfferMatrixRequest = z.infer<typeof CreateOfferMatrixRequestSchema>;

export const UpdateOfferMatrixRequestSchema = z
  .object({
    observations: z.string().optional(),
    totalAmount: z.number().min(0).optional(),
    calculatedSubsidy: z.number().min(0).optional(),
    subsidyStrategy: z.string().max(50).optional(),
  })
  .strict();
export type UpdateOfferMatrixRequest = z.infer<typeof UpdateOfferMatrixRequestSchema>;

export const ListOfferMatricesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  negotiationId: UuidSchema.optional(),
  state: MatrixStateSchema.optional(),
  creatorId: UuidSchema.optional(),
});
export type ListOfferMatricesQuery = z.infer<typeof ListOfferMatricesQuerySchema>;

export const ChangeMatrixStateRequestSchema = z.object({
  state: MatrixStateSchema,
  supervisorMessage: z.string().optional(),
});
export type ChangeMatrixStateRequest = z.infer<typeof ChangeMatrixStateRequestSchema>;

// --- Matrix Line Items ---

export const CreateMatrixLineItemRequestSchema = z.object({
  matrixId: UuidSchema,
  itemId: UuidSchema,
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});
export type CreateMatrixLineItemRequest = z.infer<typeof CreateMatrixLineItemRequestSchema>;

export const UpdateMatrixLineItemRequestSchema = z
  .object({
    quantity: z.number().int().min(1).optional(),
    unitPrice: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
  })
  .strict();
export type UpdateMatrixLineItemRequest = z.infer<typeof UpdateMatrixLineItemRequestSchema>;

export const ListMatrixLineItemsQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
  itemId: UuidSchema.optional(),
});
export type ListMatrixLineItemsQuery = z.infer<typeof ListMatrixLineItemsQuerySchema>;

// --- Matrix Attachments ---

export const CreateMatrixAttachmentRequestSchema = z.object({
  matrixId: UuidSchema,
  description: z.string().max(255).optional(),
  filename: z.string().max(255),
  fileExtension: z.string().max(10),
  fileSizeMb: z.number().min(0.01).max(50),
  storagePath: z.string().max(500),
  mimeType: z.string().max(100),
});
export type CreateMatrixAttachmentRequest = z.infer<typeof CreateMatrixAttachmentRequestSchema>;

export const ListMatrixAttachmentsQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
});
export type ListMatrixAttachmentsQuery = z.infer<typeof ListMatrixAttachmentsQuerySchema>;

// --- Matrix State History ---

export const ListMatrixStateHistoryQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
});
export type ListMatrixStateHistoryQuery = z.infer<typeof ListMatrixStateHistoryQuerySchema>;
