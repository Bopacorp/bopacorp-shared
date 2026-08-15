import { describe, expect, it } from 'vitest';
import * as Employability from '../../src/employability/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const creator = { id: secondUuid, username: 'hr.admin', email: 'hr@example.com' };
const vacancy = {
  id: uuid,
  title: 'Advisor',
  description: 'Description',
  requirements: 'Experience',
  isActive: true,
  isPublished: true,
  publicationDate: '2026-08-15T12:00:00.000Z',
  closingDate: null,
  creator,
  ...timestamps,
};
const application = {
  id: uuid,
  state: 'PENDING',
  coverLetter: 'I am interested',
  reviewNotes: null,
  reviewDate: null,
  appliedAt: '2026-08-15T12:30:00.000Z',
  vacancy: { id: uuid, title: 'Advisor' },
  candidate: { id: secondUuid, firstName: 'Ana', lastName: 'Perez', email: 'ana@example.com' },
  reviewer: null,
  resume: null,
  ...timestamps,
};

describe('employability responses', () => {
  it('validates candidate full and list projections', () => {
    expect(
      Employability.CandidateResponseSchema.safeParse({
        id: uuid,
        nationalId: '0102030405',
        firstName: 'Ana',
        lastName: 'Perez',
        email: 'ana@example.com',
        phone: null,
        address: null,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Employability.CandidateListItemResponseSchema.safeParse({
        id: uuid,
        nationalId: '0102030405',
        firstName: 'Ana',
        lastName: 'Perez',
        email: 'ana@example.com',
        phone: '0991234567',
        ...timestamps,
        address: 'stripped from list',
      }).success
    ).toBe(true);
    const result = Employability.CandidateListItemResponseSchema.safeParse({
      id: uuid,
      nationalId: '0102030405',
      firstName: 'Ana',
      lastName: 'Perez',
      email: 'ana@example.com',
      phone: '0991234567',
      ...timestamps,
      address: 'stripped from list',
    });
    if (result.success) expect('address' in result.data).toBe(false);
  });

  it('distinguishes administrative and public vacancy responses', () => {
    expect(Employability.JobVacancyResponseSchema.safeParse(vacancy).success).toBe(true);
    expect(
      Employability.JobVacancyListItemResponseSchema.safeParse({
        id: uuid,
        title: 'Advisor',
        isActive: true,
        isPublished: true,
        publicationDate: vacancy.publicationDate,
        closingDate: null,
        creator: { id: secondUuid, username: 'hr.admin' },
        ...timestamps,
      }).success
    ).toBe(true);
    const publicResult = Employability.PublicJobVacancyResponseSchema.safeParse({
      id: uuid,
      title: vacancy.title,
      description: vacancy.description,
      requirements: vacancy.requirements,
      publicationDate: vacancy.publicationDate,
      closingDate: null,
      creator: { id: secondUuid, username: 'hr.admin' },
      ...timestamps,
      isActive: true,
      isPublished: true,
    });
    expect(publicResult.success).toBe(true);
    if (publicResult.success) {
      expect('isActive' in publicResult.data).toBe(false);
      expect('isPublished' in publicResult.data).toBe(false);
      expect('email' in publicResult.data.creator).toBe(false);
    }
  });

  it('validates applications with nullable reviewer and resume data', () => {
    expect(Employability.JobApplicationResponseSchema.safeParse(application).success).toBe(true);
    expect(
      Employability.JobApplicationResponseSchema.safeParse({
        ...application,
        state: 'REJECTED',
        reviewNotes: 'Not selected',
        reviewDate: '2026-08-15T14:00:00.000Z',
        reviewer: { id: secondUuid, username: 'hr.admin', email: 'hr@example.com' },
        resume: { id: secondUuid, filename: 'resume.pdf', mimeType: 'application/pdf', fileSizeMb: 1 },
      }).success
    ).toBe(true);
    expect(
      Employability.JobApplicationListItemResponseSchema.safeParse({
        id: uuid,
        state: 'PENDING',
        appliedAt: application.appliedAt,
        hasResume: false,
        vacancy: application.vacancy,
        candidate: { id: secondUuid, firstName: 'Ana', lastName: 'Perez' },
        ...timestamps,
      }).success
    ).toBe(true);
    expect(Employability.JobApplicationResponseSchema.safeParse({ ...application, state: 'APPROVED' }).success).toBe(false);
  });

  it('validates candidate resume responses and timestamps', () => {
    expect(
      Employability.CandidateResumeResponseSchema.safeParse({
        id: uuid,
        candidateId: secondUuid,
        applicationId: null,
        filename: 'resume.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 1,
        storagePath: 'candidates/550e8400/resume.pdf',
        mimeType: 'application/pdf',
        uploadedAt: '2026-08-15T12:30:00.000Z',
        createdAt: '2026-08-15T12:30:00.000Z',
      }).success
    ).toBe(true);
    expect(
      Employability.CandidateResumeResponseSchema.safeParse({
        id: uuid,
        candidateId: secondUuid,
        applicationId: null,
        filename: 'resume.pdf',
        fileExtension: 'pdf',
        fileSizeMb: 1,
        storagePath: 'candidates/550e8400/resume.pdf',
        mimeType: 'application/pdf',
        uploadedAt: 'not-a-date',
        createdAt: '2026-08-15T12:30:00.000Z',
      }).success
    ).toBe(false);
  });
});
