import { describe, expect, it } from 'vitest';
import * as Employability from '../../src/employability/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const candidate = {
  nationalId: '0102030405',
  firstName: 'Ana',
  lastName: 'Perez',
  email: 'ana@example.com',
  phone: '0991234567',
  address: 'Main street',
};

describe('employability requests', () => {
  it('accepts every application state and rejects unknown states', () => {
    for (const state of ['DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED']) {
      expect(Employability.ApplicationStateSchema.safeParse(state).success).toBe(true);
    }
    expect(Employability.ApplicationStateSchema.safeParse('APPROVED').success).toBe(false);
  });

  it('validates candidate creation, partial updates and filters', () => {
    expect(Employability.CreateCandidateRequestSchema.safeParse(candidate).success).toBe(true);
    expect(Employability.UpdateCandidateRequestSchema.parse({ phone: '099123456' })).toEqual({
      phone: '099123456',
    });
    expect(Employability.ListCandidatesQuerySchema.parse({ search: 'ana', page: '2' })).toMatchObject({
      search: 'ana',
      page: 2,
    });
    expect(Employability.CreateCandidateRequestSchema.safeParse({ ...candidate, nationalId: 'bad' }).success).toBe(false);
    expect(Employability.CreateCandidateRequestSchema.safeParse({ ...candidate, email: 'bad' }).success).toBe(false);
  });

  it('applies vacancy publication defaults and validates dates', () => {
    expect(
      Employability.CreateJobVacancyRequestSchema.parse({
        title: 'Advisor',
        description: 'Description',
        requirements: 'Experience',
      })
    ).toMatchObject({ isActive: true, isPublished: false });
    expect(
      Employability.UpdateJobVacancyRequestSchema.parse({ isPublished: true, closingDate: '2026-09-15T00:00:00.000Z' })
    ).toMatchObject({ isPublished: true, closingDate: '2026-09-15T00:00:00.000Z' });
    expect(
      Employability.ListJobVacanciesQuerySchema.parse({ isActive: 'true', isPublished: 'false', search: 'advisor' })
    ).toMatchObject({ isActive: true, isPublished: false, search: 'advisor' });
    expect(
      Employability.CreateJobVacancyRequestSchema.safeParse({
        title: 'Advisor',
        description: 'Description',
        requirements: 'Experience',
        publicationDate: 'not-a-date',
      }).success
    ).toBe(false);
  });

  it('validates applications and state filters without imposing transitions', () => {
    expect(
      Employability.CreateJobApplicationRequestSchema.safeParse({
        vacancyId: uuid,
        candidateId: secondUuid,
        coverLetter: 'I am interested',
      }).success
    ).toBe(true);
    expect(
      Employability.UpdateJobApplicationRequestSchema.safeParse({ state: 'REJECTED', reviewNotes: 'Not selected' }).success
    ).toBe(true);
    expect(
      Employability.ListJobApplicationsQuerySchema.parse({
        vacancyId: uuid,
        candidateId: secondUuid,
        state: 'PENDING',
        reviewedBy: uuid,
      })
    ).toMatchObject({ vacancyId: uuid, state: 'PENDING' });
    expect(Employability.CreateJobApplicationRequestSchema.safeParse({ vacancyId: 'bad', candidateId: uuid }).success).toBe(
      false
    );
  });

  it('requires PDF resume metadata and applies the file size upper bound', () => {
    const request = {
      candidateId: uuid,
      filename: 'resume.pdf',
      fileExtension: 'pdf',
      fileSizeMb: 1,
      mimeType: 'application/pdf',
    };

    expect(Employability.CreateCandidateResumeRequestSchema.safeParse({ ...request, fileSizeMb: 0.01 }).success).toBe(true);
    expect(Employability.CreateCandidateResumeRequestSchema.safeParse({ ...request, fileSizeMb: 50 }).success).toBe(true);
    expect(Employability.CreateCandidateResumeRequestSchema.safeParse({ ...request, fileSizeMb: 0 }).success).toBe(false);
    expect(Employability.CreateCandidateResumeRequestSchema.safeParse({ ...request, fileSizeMb: 50.01 }).success).toBe(false);
    expect(
      Employability.CreateCandidateResumeRequestSchema.safeParse({ ...request, mimeType: 'text/plain' }).success
    ).toBe(false);
    expect(Employability.ListCandidateResumesQuerySchema.parse({ candidateId: uuid, applicationId: secondUuid })).toMatchObject({
      candidateId: uuid,
      applicationId: secondUuid,
    });
    expect(Employability.UploadCandidateResumeRequestSchema.safeParse({ candidateId: uuid }).success).toBe(true);
  });

  it('validates public application payloads and shared candidate fields', () => {
    expect(
      Employability.ApplyJobVacancyRequestSchema.safeParse({
        candidate,
        vacancyId: uuid,
        coverLetter: 'Please consider my application',
      }).success
    ).toBe(true);
    expect(
      Employability.ApplyJobVacancyFormSchema.safeParse({
        ...candidate,
        coverLetter: 'Please consider my application',
      }).success
    ).toBe(true);
    expect(
      Employability.ApplyJobVacancyRequestSchema.safeParse({ candidate, vacancyId: 'bad' }).success
    ).toBe(false);
  });
});
