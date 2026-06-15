import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';
import { ApplicationStateSchema } from './enums.js';

// --- Candidate ---

export const CandidateResponseSchema = z
  .object({
    id: UuidSchema,
    nationalId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
  })
  .merge(TimestampsSchema);
export type CandidateResponse = z.infer<typeof CandidateResponseSchema>;

export const CandidateListItemResponseSchema = z
  .object({
    id: UuidSchema,
    nationalId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
  })
  .merge(TimestampsSchema);
export type CandidateListItemResponse = z.infer<typeof CandidateListItemResponseSchema>;

// --- Job vacancy ---

const JobVacancyCreatorSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
});

export const JobVacancyResponseSchema = z
  .object({
    id: UuidSchema,
    title: z.string(),
    description: z.string(),
    requirements: z.string(),
    isActive: z.boolean(),
    isPublished: z.boolean(),
    publicationDate: z.string().datetime().nullable(),
    closingDate: z.string().datetime().nullable(),
    creator: JobVacancyCreatorSchema,
  })
  .merge(TimestampsSchema);
export type JobVacancyResponse = z.infer<typeof JobVacancyResponseSchema>;

export const JobVacancyListItemResponseSchema = z
  .object({
    id: UuidSchema,
    title: z.string(),
    isActive: z.boolean(),
    isPublished: z.boolean(),
    publicationDate: z.string().datetime().nullable(),
    closingDate: z.string().datetime().nullable(),
    creator: z.object({
      id: UuidSchema,
      username: z.string(),
    }),
  })
  .merge(TimestampsSchema);
export type JobVacancyListItemResponse = z.infer<typeof JobVacancyListItemResponseSchema>;

// --- Job application ---

const ApplicationVacancySchema = z.object({
  id: UuidSchema,
  title: z.string(),
});

const ApplicationCandidateSchema = z.object({
  id: UuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

const ApplicationReviewerSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
});

export const JobApplicationResumeSchema = z.object({
  id: UuidSchema,
  filename: z.string(),
  mimeType: z.string(),
  fileSizeMb: z.number(),
});
export type JobApplicationResume = z.infer<typeof JobApplicationResumeSchema>;

export const JobApplicationResponseSchema = z
  .object({
    id: UuidSchema,
    state: ApplicationStateSchema,
    coverLetter: z.string().nullable(),
    reviewNotes: z.string().nullable(),
    reviewDate: z.string().datetime().nullable(),
    appliedAt: z.string().datetime().nullable(),
    vacancy: ApplicationVacancySchema,
    candidate: ApplicationCandidateSchema,
    reviewer: ApplicationReviewerSchema.nullable(),
    resume: JobApplicationResumeSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type JobApplicationResponse = z.infer<typeof JobApplicationResponseSchema>;

export const JobApplicationListItemResponseSchema = z
  .object({
    id: UuidSchema,
    state: ApplicationStateSchema,
    appliedAt: z.string().datetime().nullable(),
    hasResume: z.boolean(),
    vacancy: ApplicationVacancySchema,
    candidate: z.object({
      id: UuidSchema,
      firstName: z.string(),
      lastName: z.string(),
    }),
  })
  .merge(TimestampsSchema);
export type JobApplicationListItemResponse = z.infer<typeof JobApplicationListItemResponseSchema>;

// --- Candidate resume ---

export const CandidateResumeResponseSchema = z.object({
  id: UuidSchema,
  candidateId: UuidSchema,
  applicationId: UuidSchema.nullable(),
  filename: z.string(),
  fileExtension: z.string(),
  fileSizeMb: z.number(),
  storagePath: z.string(),
  mimeType: z.string(),
  uploadedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type CandidateResumeResponse = z.infer<typeof CandidateResumeResponseSchema>;
