import { z } from 'zod';

export const MatrixStateSchema = z.enum([
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
]);
export type MatrixState = z.infer<typeof MatrixStateSchema>;
