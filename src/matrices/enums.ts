import { z } from 'zod';

export const AttachmentTypeSchema = z.enum(['OFFER_MATRIX', 'EMAIL_TEMPLATE']);
export type AttachmentType = z.infer<typeof AttachmentTypeSchema>;

export const MatrixApprovalDecisionSchema = z.enum(['approved', 'rejected']);
export type MatrixApprovalDecision = z.infer<typeof MatrixApprovalDecisionSchema>;
