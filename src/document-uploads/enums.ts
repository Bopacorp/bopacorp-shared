import { z } from 'zod';

export const EncryptionMetadataSchema = z.object({
  iv: z.string(),
  authTag: z.string(),
});
export type EncryptionMetadata = z.infer<typeof EncryptionMetadataSchema>;
