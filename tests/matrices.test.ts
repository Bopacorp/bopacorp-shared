import { describe, expect, it } from 'vitest';
import * as Matrices from '../src/matrices/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};

describe('matrices residual contracts', () => {
  it('accepts attachment and review decision enums', () => {
    expect(Matrices.AttachmentTypeSchema.safeParse('OFFER_MATRIX').success).toBe(true);
    expect(Matrices.AttachmentTypeSchema.safeParse('EMAIL_TEMPLATE').success).toBe(true);
    expect(Matrices.MatrixApprovalDecisionSchema.safeParse('approved').success).toBe(true);
    expect(Matrices.MatrixApprovalDecisionSchema.safeParse('rejected').success).toBe(true);
    expect(Matrices.MatrixApprovalDecisionSchema.safeParse('pending').success).toBe(false);
  });

  it('validates matrix requests and strict updates', () => {
    expect(Matrices.CreateOfferMatrixRequestSchema.safeParse({ negotiationId: uuid }).success).toBe(true);
    expect(Matrices.UpdateOfferMatrixRequestSchema.parse({ observations: 'Updated' })).toEqual({
      observations: 'Updated',
    });
    expect(Matrices.UpdateOfferMatrixRequestSchema.safeParse({ negotiationId: uuid }).success).toBe(false);
    expect(
      Matrices.CreateMatrixAttachmentRequestSchema.safeParse({
        matrixId: uuid,
        attachmentType: 'OFFER_MATRIX',
        filename: 'offer.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 0.01,
        storagePath: 'matrices/offer.pdf',
        mimeType: 'application/pdf',
      }).success
    ).toBe(true);
    expect(
      Matrices.CreateMatrixAttachmentRequestSchema.safeParse({
        matrixId: uuid,
        attachmentType: 'OFFER_MATRIX',
        filename: 'offer.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 50.01,
        storagePath: 'matrices/offer.pdf',
        mimeType: 'application/pdf',
      }).success
    ).toBe(false);
    expect(Matrices.ListMatrixAttachmentsQuerySchema.parse({ matrixId: uuid }).matrixId).toBe(uuid);
  });

  it('validates the approved/rejected discriminated union', () => {
    expect(Matrices.ReviewOfferMatrixRequestSchema.safeParse({ decision: 'approved' }).success).toBe(true);
    expect(
      Matrices.ReviewOfferMatrixRequestSchema.safeParse({ decision: 'rejected', rejectionReason: 'Needs correction' }).success
    ).toBe(true);
    expect(Matrices.ReviewOfferMatrixRequestSchema.safeParse({ decision: 'rejected' }).success).toBe(false);
    const approvedWithExtraField = Matrices.ReviewOfferMatrixRequestSchema.safeParse({
      decision: 'approved',
      rejectionReason: 'Unexpected',
    });
    expect(approvedWithExtraField.success).toBe(true);
    if (approvedWithExtraField.success) expect('rejectionReason' in approvedWithExtraField.data).toBe(false);
  });

  it('validates residual matrix responses without claiming business completion', () => {
    const user = {
      id: secondUuid,
      username: 'ana.perez',
      email: 'ana@example.com',
      profile: { firstName: 'Ana', lastName: 'Perez' },
    };
    expect(
      Matrices.OfferMatrixResponseSchema.safeParse({
        id: uuid,
        observations: null,
        negotiation: { id: secondUuid, client: { id: uuid, businessName: 'Acme' } },
        creator: user,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Matrices.MatrixAttachmentResponseSchema.safeParse({
        id: uuid,
        attachmentType: 'OFFER_MATRIX',
        description: null,
        filename: 'offer.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 1,
        storagePath: 'matrices/offer.pdf',
        mimeType: 'application/pdf',
        uploadedAt: timestamps.createdAt,
        uploadedBy: { id: secondUuid, username: 'ana.perez' },
      }).success
    ).toBe(true);
  });
});
