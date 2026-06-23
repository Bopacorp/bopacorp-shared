import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { AttachmentTypeSchema } from './enums.js';

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

// --- Offer Matrices ---

export const OfferMatrixResponseSchema = z
  .object({
    id: UuidSchema,
    observations: z.string().nullable(),
    negotiation: NegotiationRefSchema,
    creator: UserRefSchema,
  })
  .merge(TimestampsSchema);
export type OfferMatrixResponse = z.infer<typeof OfferMatrixResponseSchema>;

export const OfferMatrixListItemResponseSchema = z
  .object({
    id: UuidSchema,
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

// --- Matrix Attachments ---

export const MatrixAttachmentResponseSchema = z.object({
  id: UuidSchema,
  attachmentType: AttachmentTypeSchema,
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
