import { z } from 'zod';

export const DocumentStateSchema = z.enum(['PENDING_APPROVAL', 'ACCEPTED', 'REJECTED']);
export type DocumentState = z.infer<typeof DocumentStateSchema>;
