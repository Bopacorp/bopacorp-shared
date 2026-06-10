import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { MatrixStateSchema } from './enums.js';

// --- Nested reference schemas (not exported) ---

const NegotiationRefSchema = z.object({
  id: UuidSchema,
  client: z.object({
    id: UuidSchema,
    businessName: z.string(),
  }),
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

const CatalogItemRefSchema = z.object({
  id: UuidSchema,
  name: z.string(),
  code: z.string().nullable(),
});

const SlimCatalogItemRefSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

// --- Offer Matrices ---

export const OfferMatrixResponseSchema = z
  .object({
    id: UuidSchema,
    state: MatrixStateSchema,
    observations: z.string().nullable(),
    totalAmount: z.number(),
    calculatedSubsidy: z.number(),
    subsidyStrategy: z.string(),
    approvalDate: z.string().datetime().nullable(),
    supervisorMessage: z.string().nullable(),
    negotiation: NegotiationRefSchema,
    creator: UserRefSchema,
    approvedBy: SlimUserRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type OfferMatrixResponse = z.infer<typeof OfferMatrixResponseSchema>;

export const OfferMatrixListItemResponseSchema = z
  .object({
    id: UuidSchema,
    state: MatrixStateSchema,
    totalAmount: z.number(),
    calculatedSubsidy: z.number(),
    subsidyStrategy: z.string(),
    negotiation: z.object({
      id: UuidSchema,
      client: z.object({
        id: UuidSchema,
        businessName: z.string(),
      }),
    }),
    creator: SlimUserRefSchema,
  })
  .merge(TimestampsSchema);
export type OfferMatrixListItemResponse = z.infer<typeof OfferMatrixListItemResponseSchema>;

// --- Matrix Line Items ---

export const MatrixLineItemResponseSchema = z
  .object({
    id: UuidSchema,
    quantity: z.number().int(),
    unitPrice: z.number(),
    total: z.number(),
    item: CatalogItemRefSchema,
  })
  .merge(TimestampsSchema);
export type MatrixLineItemResponse = z.infer<typeof MatrixLineItemResponseSchema>;

export const MatrixLineItemListItemResponseSchema = z
  .object({
    id: UuidSchema,
    quantity: z.number().int(),
    unitPrice: z.number(),
    total: z.number(),
    item: SlimCatalogItemRefSchema,
  })
  .merge(TimestampsSchema);
export type MatrixLineItemListItemResponse = z.infer<typeof MatrixLineItemListItemResponseSchema>;

// --- Matrix Attachments ---

export const MatrixAttachmentResponseSchema = z.object({
  id: UuidSchema,
  description: z.string().nullable(),
  filename: z.string(),
  fileExtension: z.string(),
  fileSizeMb: z.number(),
  storagePath: z.string(),
  mimeType: z.string(),
  uploadedAt: z.string().datetime(),
  uploadedBy: SlimUserRefSchema,
});
export type MatrixAttachmentResponse = z.infer<typeof MatrixAttachmentResponseSchema>;

// --- Matrix State History ---

export const MatrixStateHistoryResponseSchema = z.object({
  id: UuidSchema,
  previousState: MatrixStateSchema.nullable(),
  newState: MatrixStateSchema,
  changedBy: SlimUserRefSchema,
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type MatrixStateHistoryResponse = z.infer<typeof MatrixStateHistoryResponseSchema>;
