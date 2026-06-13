import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { DocumentStateSchema } from './enums.js';

// --- Document Types ---

export const CreateDocumentTypeRequestSchema = z.object({
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isMandatory: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type CreateDocumentTypeRequest = z.infer<typeof CreateDocumentTypeRequestSchema>;

export const UpdateDocumentTypeRequestSchema = CreateDocumentTypeRequestSchema.partial();
export type UpdateDocumentTypeRequest = z.infer<typeof UpdateDocumentTypeRequestSchema>;

export const ListDocumentTypesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isMandatory: z.coerce.boolean().optional(),
});
export type ListDocumentTypesQuery = z.infer<typeof ListDocumentTypesQuerySchema>;

// --- Negotiation Documents ---

export const CreateNegotiationDocumentRequestSchema = z.object({
  negotiationId: UuidSchema,
  documentTypeId: UuidSchema,
  filename: z.string().max(255),
  fileExtension: z.string().max(10),
  fileSizeMb: z.number().min(0.01).max(50),
  storagePath: z.string().max(500),
  mimeType: z.string().max(100),
  description: z.string().max(255).optional(),
});
export type CreateNegotiationDocumentRequest = z.infer<
  typeof CreateNegotiationDocumentRequestSchema
>;

export const UpdateNegotiationDocumentRequestSchema = z
  .object({
    filename: z.string().max(255).optional(),
    storagePath: z.string().max(500).optional(),
    mimeType: z.string().max(100).optional(),
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
});
export type ListNegotiationDocumentsQuery = z.infer<typeof ListNegotiationDocumentsQuerySchema>;

export const ChangeDocumentStateRequestSchema = z.object({
  state: DocumentStateSchema,
  coordinatorMessage: z.string().optional(),
});
export type ChangeDocumentStateRequest = z.infer<typeof ChangeDocumentStateRequestSchema>;

// --- Document State History ---

export const ListDocumentStateHistoryQuerySchema = PaginationQuerySchema.extend({
  documentId: UuidSchema,
});
export type ListDocumentStateHistoryQuery = z.infer<typeof ListDocumentStateHistoryQuerySchema>;
