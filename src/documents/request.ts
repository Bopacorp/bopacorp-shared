import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import { BooleanQuerySchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { EncryptionMetadataSchema } from '../document-uploads/enums.js';
import { DocumentStateSchema } from './enums.js';

// --- Document Types ---

export const CreateDocumentTypeRequestSchema = z.object({
  code: z.string().min(1, V.REQUIRED).max(30, vk(V.MAX_CHARS, { max: 30 })),
  name: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
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
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  encryptionMetadata: EncryptionMetadataSchema,
});
export type CreateNegotiationDocumentRequest = z.infer<
  typeof CreateNegotiationDocumentRequestSchema
>;

export const UpdateNegotiationDocumentRequestSchema = z
  .object({
    filename: z
      .string()
      .min(1, V.REQUIRED)
      .max(255, vk(V.MAX_CHARS, { max: 255 }))
      .optional(),
    storagePath: z
      .string()
      .min(1, V.REQUIRED)
      .max(500, vk(V.MAX_CHARS, { max: 500 }))
      .optional(),
    mimeType: z
      .string()
      .min(1, V.REQUIRED)
      .max(100, vk(V.MAX_CHARS, { max: 100 }))
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
  coordinatorMessage: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
});
export type ChangeDocumentStateRequest = z.infer<typeof ChangeDocumentStateRequestSchema>;

// --- Document State History ---

export const ListDocumentStateHistoryQuerySchema = PaginationQuerySchema.extend({
  documentId: UuidSchema,
});
export type ListDocumentStateHistoryQuery = z.infer<typeof ListDocumentStateHistoryQuerySchema>;
