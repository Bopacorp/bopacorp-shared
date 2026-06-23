import { z } from 'zod';

export const AttachmentTypeSchema = z.enum(['OFFER_MATRIX', 'EMAIL_TEMPLATE']);
export type AttachmentType = z.infer<typeof AttachmentTypeSchema>;
