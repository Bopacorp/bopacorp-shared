import { z } from 'zod';

export const ApplicationStateSchema = z.enum(['DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED']);
export type ApplicationState = z.infer<typeof ApplicationStateSchema>;
