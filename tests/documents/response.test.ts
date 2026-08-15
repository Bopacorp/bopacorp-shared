import { describe, expect, it } from 'vitest';
import {
  DocumentStateHistoryResponseSchema,
  DocumentTypeResponseSchema,
  NegotiationDocumentListItemResponseSchema,
  NegotiationDocumentResponseSchema,
} from '../../src/documents/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const documentType = { id: uuid, code: 'RUC', name: 'RUC document' };
const user = {
  id: secondUuid,
  username: 'ana.perez',
  email: 'ana@bopacorp.com',
  profile: { firstName: 'Ana', lastName: 'Perez' },
};
const slimUser = { id: secondUuid, username: 'ana.perez' };
const negotiation = { id: uuid, client: { id: secondUuid, businessName: 'Acme Corporation' } };
const fullDocument = {
  id: uuid,
  state: 'PENDING_APPROVAL',
  filename: 'ruc.pdf',
  fileExtension: 'pdf',
  fileSizeMb: 1.25,
  storagePath: 'negotiations/550e8400/ruc.pdf',
  mimeType: 'application/pdf',
  reviewDate: null,
  coordinatorMessage: null,
  uploadedAt: '2026-08-15T12:30:00.000Z',
  negotiation,
  documentType: { id: uuid, code: 'RUC', name: 'RUC document' },
  uploadedBy: user,
  reviewedBy: null,
  ...timestamps,
};

describe('document responses', () => {
  it('validates document types and complete document responses', () => {
    expect(
      DocumentTypeResponseSchema.safeParse({
        ...documentType,
        description: null,
        isMandatory: true,
        isActive: true,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(NegotiationDocumentResponseSchema.safeParse(fullDocument).success).toBe(true);
    expect(NegotiationDocumentResponseSchema.safeParse({ ...fullDocument, state: 'APPROVED' }).success).toBe(false);
    expect(NegotiationDocumentResponseSchema.safeParse({ ...fullDocument, uploadedAt: 'not-a-date' }).success).toBe(false);
  });

  it('validates slim document responses and nullable review fields', () => {
    expect(
      NegotiationDocumentListItemResponseSchema.safeParse({
        id: uuid,
        state: 'ACCEPTED',
        filename: 'ruc.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 1.25,
        uploadedAt: '2026-08-15T12:30:00.000Z',
        negotiation,
        documentType: { id: uuid, name: 'RUC document' },
        uploadedBy: slimUser,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      NegotiationDocumentResponseSchema.safeParse({
        ...fullDocument,
        state: 'REJECTED',
        reviewDate: '2026-08-15T14:00:00.000Z',
        coordinatorMessage: 'Missing signature',
        reviewedBy: slimUser,
      }).success
    ).toBe(true);
    expect(
      NegotiationDocumentListItemResponseSchema.safeParse({
        id: uuid,
        state: 'PENDING_APPROVAL',
        filename: 'ruc.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 1.25,
        uploadedAt: '2026-08-15T12:30:00.000Z',
        negotiation: { id: 'bad', client: { id: secondUuid, businessName: 'Acme Corporation' } },
        documentType: { id: uuid, name: 'RUC document' },
        uploadedBy: slimUser,
        ...timestamps,
      }).success
    ).toBe(false);
  });

  it('validates document state history with nullable previous state and notes', () => {
    expect(
      DocumentStateHistoryResponseSchema.safeParse({
        id: secondUuid,
        previousState: null,
        newState: 'PENDING_APPROVAL',
        changedBy: slimUser,
        notes: null,
        createdAt: '2026-08-15T12:30:00.000Z',
      }).success
    ).toBe(true);
    expect(
      DocumentStateHistoryResponseSchema.safeParse({
        id: secondUuid,
        previousState: 'PENDING_APPROVAL',
        newState: 'REJECTED',
        changedBy: slimUser,
        notes: 'Missing signature',
        createdAt: '2026-08-15T12:30:00.000Z',
      }).success
    ).toBe(true);
    expect(
      DocumentStateHistoryResponseSchema.safeParse({
        id: secondUuid,
        previousState: 'APPROVED',
        newState: 'REJECTED',
        changedBy: slimUser,
        notes: null,
        createdAt: '2026-08-15T12:30:00.000Z',
      }).success
    ).toBe(false);
  });

  it('keeps list responses slim when full document detail is supplied', () => {
    const result = NegotiationDocumentListItemResponseSchema.safeParse(fullDocument);

    expect(result.success).toBe(true);
    if (result.success) {
      expect('storagePath' in result.data).toBe(false);
      expect('mimeType' in result.data).toBe(false);
      expect('reviewDate' in result.data).toBe(false);
      expect('coordinatorMessage' in result.data).toBe(false);
    }
  });
});
