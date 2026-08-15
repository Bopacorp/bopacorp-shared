import { describe, expect, it } from 'vitest';
import {
  ChangeDocumentStateRequestSchema,
  CreateDocumentTypeRequestSchema,
  CreateNegotiationDocumentRequestSchema,
  DocumentStateSchema,
  ListDocumentStateHistoryQuerySchema,
  ListDocumentTypesQuerySchema,
  ListNegotiationDocumentsQuerySchema,
  UpdateDocumentTypeRequestSchema,
  UpdateNegotiationDocumentRequestSchema,
} from '../../src/documents/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const encryptionMetadata = { iv: 'iv-value', authTag: 'auth-tag-value' };

describe('document requests', () => {
  it('accepts every document state and rejects unknown states', () => {
    for (const state of ['PENDING_APPROVAL', 'ACCEPTED', 'REJECTED']) {
      expect(DocumentStateSchema.safeParse(state).success).toBe(true);
    }
    expect(DocumentStateSchema.safeParse('APPROVED').success).toBe(false);
  });

  it('applies document type defaults and partial update semantics', () => {
    expect(CreateDocumentTypeRequestSchema.parse({ code: 'RUC', name: 'RUC document' })).toEqual({
      code: 'RUC',
      name: 'RUC document',
      isMandatory: false,
      isActive: true,
    });
    expect(UpdateDocumentTypeRequestSchema.parse({ isMandatory: true })).toEqual({ isMandatory: true, isActive: true });
    expect(ListDocumentTypesQuerySchema.parse({ isActive: 'true', isMandatory: 'false' })).toMatchObject({
      isActive: true,
      isMandatory: false,
    });
    expect(CreateDocumentTypeRequestSchema.safeParse({ code: '', name: 'RUC document' }).success).toBe(false);
  });

  it('accepts file metadata at the declared size boundaries', () => {
    const base = {
      negotiationId: uuid,
      documentTypeId: uuid,
      filename: 'ruc.pdf',
      fileExtension: 'pdf',
      storagePath: 'negotiations/550e8400/ruc.pdf',
      mimeType: 'application/pdf',
      encryptionMetadata,
    };

    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, fileSizeMb: 0.01 }).success).toBe(true);
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, fileSizeMb: 50 }).success).toBe(true);
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, fileSizeMb: 0 }).success).toBe(false);
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, fileSizeMb: 50.01 }).success).toBe(false);
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, encryptionMetadata: { iv: 'iv' } }).success).toBe(
      false
    );
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, mimeType: '' }).success).toBe(false);
    expect(CreateNegotiationDocumentRequestSchema.safeParse({ ...base, fileExtension: 'x'.repeat(11) }).success).toBe(
      false
    );
  });

  it('keeps document updates partial and rejects unknown fields strictly', () => {
    expect(UpdateNegotiationDocumentRequestSchema.parse({ filename: 'updated.pdf' })).toEqual({
      filename: 'updated.pdf',
    });
    expect(UpdateNegotiationDocumentRequestSchema.safeParse({ description: 'not accepted here' }).success).toBe(false);
    expect(UpdateNegotiationDocumentRequestSchema.safeParse({ filename: '' }).success).toBe(false);
  });

  it('validates document filters, state changes and history queries', () => {
    expect(
      ListNegotiationDocumentsQuerySchema.parse({
        negotiationId: uuid,
        documentTypeId: uuid,
        state: 'REJECTED',
        uploadedBy: uuid,
        advisorId: uuid,
      })
    ).toMatchObject({ state: 'REJECTED', negotiationId: uuid });
    expect(ChangeDocumentStateRequestSchema.parse({ state: 'ACCEPTED' })).toEqual({ state: 'ACCEPTED' });
    expect(
      ChangeDocumentStateRequestSchema.parse({ state: 'REJECTED', coordinatorMessage: 'Missing signature' })
    ).toEqual({ state: 'REJECTED', coordinatorMessage: 'Missing signature' });
    expect(ListDocumentStateHistoryQuerySchema.parse({ documentId: uuid }).documentId).toBe(uuid);
    expect(ListNegotiationDocumentsQuerySchema.safeParse({ state: 'APPROVED' }).success).toBe(false);
    expect(ListDocumentStateHistoryQuerySchema.safeParse({}).success).toBe(false);
  });
});
