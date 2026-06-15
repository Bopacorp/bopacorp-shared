import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { DocumentStateSchema } from './enums.js';

// --- Nested reference schemas (not exported) ---

const DocumentTypeRefSchema = z.object({
  id: UuidSchema,
  code: z.string(),
  name: z.string(),
});

const SlimDocumentTypeRefSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

const UserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
});

const SlimUserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
});

const NegotiationRefSchema = z.object({
  id: UuidSchema,
  client: z.object({
    id: UuidSchema,
    businessName: z.string(),
  }),
});

const SlimNegotiationRefSchema = z.object({
  id: UuidSchema,
  client: z.object({
    id: UuidSchema,
    businessName: z.string(),
  }),
});

// --- Document Types ---

export const DocumentTypeResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isMandatory: z.boolean(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type DocumentTypeResponse = z.infer<typeof DocumentTypeResponseSchema>;

// --- Negotiation Documents ---

export const NegotiationDocumentResponseSchema = z
  .object({
    id: UuidSchema,
    state: DocumentStateSchema,
    filename: z.string(),
    fileExtension: z.string(),
    fileSizeMb: z.number(),
    storagePath: z.string(),
    mimeType: z.string(),
    reviewDate: z.string().datetime().nullable(),
    coordinatorMessage: z.string().nullable(),
    uploadedAt: z.string().datetime(),
    negotiation: NegotiationRefSchema,
    documentType: DocumentTypeRefSchema,
    uploadedBy: UserRefSchema,
    reviewedBy: SlimUserRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type NegotiationDocumentResponse = z.infer<typeof NegotiationDocumentResponseSchema>;

export const NegotiationDocumentListItemResponseSchema = z
  .object({
    id: UuidSchema,
    state: DocumentStateSchema,
    filename: z.string(),
    fileExtension: z.string(),
    fileSizeMb: z.number(),
    uploadedAt: z.string().datetime(),
    negotiation: SlimNegotiationRefSchema,
    documentType: SlimDocumentTypeRefSchema,
    uploadedBy: SlimUserRefSchema,
  })
  .merge(TimestampsSchema);
export type NegotiationDocumentListItemResponse = z.infer<
  typeof NegotiationDocumentListItemResponseSchema
>;

// --- Document State History ---

export const DocumentStateHistoryResponseSchema = z.object({
  id: UuidSchema,
  previousState: DocumentStateSchema.nullable(),
  newState: DocumentStateSchema,
  changedBy: SlimUserRefSchema,
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type DocumentStateHistoryResponse = z.infer<typeof DocumentStateHistoryResponseSchema>;
