import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { MatrixStateSchema } from './enums.js';

// --- Offer Matrices ---

export const CreateOfferMatrixRequestSchema = z.object({
  negotiationId: UuidSchema,
  observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  totalAmount: z.number().min(0, 'El monto total no puede ser negativo').default(0),
  calculatedSubsidy: z.number().min(0, 'El subsidio no puede ser negativo').default(0),
  subsidyStrategy: z.string().max(50, 'Máximo 50 caracteres').default('STANDARD'),
});
export type CreateOfferMatrixRequest = z.infer<typeof CreateOfferMatrixRequestSchema>;

export const UpdateOfferMatrixRequestSchema = z
  .object({
    observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
    totalAmount: z.number().min(0, 'El monto total no puede ser negativo').optional(),
    calculatedSubsidy: z.number().min(0, 'El subsidio no puede ser negativo').optional(),
    subsidyStrategy: z.string().max(50, 'Máximo 50 caracteres').optional(),
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
  supervisorMessage: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
export type ChangeMatrixStateRequest = z.infer<typeof ChangeMatrixStateRequestSchema>;

// --- Matrix Line Items ---

export const CreateMatrixLineItemRequestSchema = z.object({
  matrixId: UuidSchema,
  itemId: UuidSchema,
  quantity: z.number().int('Debe ser un número entero').min(1, 'Debe ser al menos 1'),
  unitPrice: z.number().min(0, 'El precio unitario no puede ser negativo'),
  total: z.number().min(0, 'El total no puede ser negativo'),
});
export type CreateMatrixLineItemRequest = z.infer<typeof CreateMatrixLineItemRequestSchema>;

export const UpdateMatrixLineItemRequestSchema = z
  .object({
    quantity: z.number().int('Debe ser un número entero').min(1, 'Debe ser al menos 1').optional(),
    unitPrice: z.number().min(0, 'El precio unitario no puede ser negativo').optional(),
    total: z.number().min(0, 'El total no puede ser negativo').optional(),
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

// --- Matrix State History ---

export const ListMatrixStateHistoryQuerySchema = PaginationQuerySchema.extend({
  matrixId: UuidSchema,
});
export type ListMatrixStateHistoryQuery = z.infer<typeof ListMatrixStateHistoryQuerySchema>;
