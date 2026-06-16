import { z } from 'zod';
import { EncryptionMetadataSchema } from './enums.js';

export const UploadDocumentResponseSchema = z.object({
  storagePath: z.string(),
  filename: z.string(),
  fileExtension: z.string(),
  fileSizeMb: z.number(),
  mimeType: z.string(),
  encryptionMetadata: EncryptionMetadataSchema,
});
export type UploadDocumentResponse = z.infer<typeof UploadDocumentResponseSchema>;
