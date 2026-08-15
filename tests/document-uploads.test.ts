import { describe, expect, it } from 'vitest';
import { EncryptionMetadataSchema, UploadDocumentResponseSchema } from '../src/document-uploads/index.js';

describe('document upload contracts', () => {
  it('requires encryption metadata fields', () => {
    expect(EncryptionMetadataSchema.safeParse({ iv: 'iv-value', authTag: 'auth-tag-value' }).success).toBe(true);
    expect(EncryptionMetadataSchema.safeParse({ iv: 'iv-value' }).success).toBe(false);
    expect(EncryptionMetadataSchema.safeParse({ iv: 1, authTag: 'auth-tag-value' }).success).toBe(false);
  });

  it('validates the upload response metadata', () => {
    const response = {
      storagePath: 'negotiations/550e8400/ruc.pdf',
      filename: 'ruc.pdf',
      fileExtension: 'pdf',
      fileSizeMb: 1.25,
      mimeType: 'application/pdf',
      encryptionMetadata: { iv: 'iv-value', authTag: 'auth-tag-value' },
    };

    expect(UploadDocumentResponseSchema.safeParse(response).success).toBe(true);
    expect(UploadDocumentResponseSchema.safeParse({ ...response, encryptionMetadata: {} }).success).toBe(false);
    expect(UploadDocumentResponseSchema.safeParse({ ...response, fileSizeMb: '1.25' }).success).toBe(false);
    expect(UploadDocumentResponseSchema.safeParse({ ...response, mimeType: undefined }).success).toBe(false);
  });
});
