import { z } from 'zod';
import { BooleanQuerySchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { EncryptionMetadataSchema } from '../document-uploads/enums.js';
import { DocumentStateSchema } from './enums.js';

// --- Document Types ---

export const CreateDocumentTypeRequestSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(30, 'Máximo 30 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isMandatory: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type CreateDocumentTypeRequest = z.infer<typeof CreateDocumentTypeRequestSchema>;

export const UpdateDocumentTypeRequestSchema = CreateDocumentTypeRequestSchema.partial();
export type UpdateDocumentTypeRequest = z.infer<typeof UpdateDocumentTypeRequestSchema>;

export const ListDocumentTypesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
  isMandatory: BooleanQuerySchema.optional(),
});
export type ListDocumentTypesQuery = z.infer<typeof ListDocumentTypesQuerySchema>;

// --- Negotiation Documents ---

export const CreateNegotiationDocumentRequestSchema = z.object({
  negotiationId: UuidSchema,
  documentTypeId: UuidSchema,
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
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  encryptionMetadata: EncryptionMetadataSchema,
});
export type CreateNegotiationDocumentRequest = z.infer<
  typeof CreateNegotiationDocumentRequestSchema
>;

export const UpdateNegotiationDocumentRequestSchema = z
  .object({
    filename: z
      .string()
      .min(1, 'El nombre del archivo es obligatorio')
      .max(255, 'Máximo 255 caracteres')
      .optional(),
    storagePath: z
      .string()
      .min(1, 'La ruta de almacenamiento es obligatoria')
      .max(500, 'Máximo 500 caracteres')
      .optional(),
    mimeType: z
      .string()
      .min(1, 'El tipo MIME es obligatorio')
      .max(100, 'Máximo 100 caracteres')
      .optional(),
  })
  .strict();
export type UpdateNegotiationDocumentRequest = z.infer<
  typeof UpdateNegotiationDocumentRequestSchema
>;

export const ListNegotiationDocumentsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  negotiationId: UuidSchema.optional(),
  documentTypeId: UuidSchema.optional(),
  state: DocumentStateSchema.optional(),
  uploadedBy: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
});
export type ListNegotiationDocumentsQuery = z.infer<typeof ListNegotiationDocumentsQuerySchema>;

export const ChangeDocumentStateRequestSchema = z.object({
  state: DocumentStateSchema,
  coordinatorMessage: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
export type ChangeDocumentStateRequest = z.infer<typeof ChangeDocumentStateRequestSchema>;

// --- Document State History ---

export const ListDocumentStateHistoryQuerySchema = PaginationQuerySchema.extend({
  documentId: UuidSchema,
});
export type ListDocumentStateHistoryQuery = z.infer<typeof ListDocumentStateHistoryQuerySchema>;
