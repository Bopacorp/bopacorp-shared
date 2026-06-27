import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import {
  BooleanQuerySchema,
  EcuadorianIdSchema,
  EmailSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';
import { ApplicationStateSchema } from './enums.js';

// --- Candidate management ---

export const CreateCandidateRequestSchema = z.object({
  nationalId: EcuadorianIdSchema,
  firstName: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  lastName: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  email: EmailSchema,
  phone: PhoneSchema,
  address: z.string().max(255, vk(V.ADDRESS_MAX, { max: 255 })).optional(),
});
export type CreateCandidateRequest = z.infer<typeof CreateCandidateRequestSchema>;

export const UpdateCandidateRequestSchema = CreateCandidateRequestSchema.partial();
export type UpdateCandidateRequest = z.infer<typeof UpdateCandidateRequestSchema>;

export const ListCandidatesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
});
export type ListCandidatesQuery = z.infer<typeof ListCandidatesQuerySchema>;

// --- Job vacancy management ---

export const CreateJobVacancyRequestSchema = z.object({
  title: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(255, vk(V.MAX_CHARS, { max: 255 })),
  description: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED),
  requirements: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  publicationDate: z.string().datetime(V.DATETIME_INVALID).optional(),
  closingDate: z.string().datetime(V.DATETIME_INVALID).optional(),
});
export type CreateJobVacancyRequest = z.infer<typeof CreateJobVacancyRequestSchema>;

export const UpdateJobVacancyRequestSchema = CreateJobVacancyRequestSchema.partial();
export type UpdateJobVacancyRequest = z.infer<typeof UpdateJobVacancyRequestSchema>;

export const ListJobVacanciesQuerySchema = PaginationQuerySchema.extend({
  isActive: BooleanQuerySchema.optional(),
  isPublished: BooleanQuerySchema.optional(),
  search: z.string().optional(),
});
export type ListJobVacanciesQuery = z.infer<typeof ListJobVacanciesQuerySchema>;

// --- Job application management ---

export const CreateJobApplicationRequestSchema = z.object({
  vacancyId: UuidSchema,
  candidateId: UuidSchema,
  coverLetter: z.string().max(2000, vk(V.MAX_CHARS, { max: 2000 })).optional(),
});
export type CreateJobApplicationRequest = z.infer<typeof CreateJobApplicationRequestSchema>;

export const UpdateJobApplicationRequestSchema = z.object({
  state: ApplicationStateSchema.optional(),
  reviewNotes: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
});
export type UpdateJobApplicationRequest = z.infer<typeof UpdateJobApplicationRequestSchema>;

export const ListJobApplicationsQuerySchema = PaginationQuerySchema.extend({
  vacancyId: UuidSchema.optional(),
  candidateId: UuidSchema.optional(),
  state: ApplicationStateSchema.optional(),
  reviewedBy: UuidSchema.optional(),
});
export type ListJobApplicationsQuery = z.infer<typeof ListJobApplicationsQuerySchema>;

// --- Candidate resume management ---

export const CreateCandidateResumeRequestSchema = z.object({
  candidateId: UuidSchema,
  applicationId: UuidSchema.optional(),
  filename: z
    .string({ error: V.REQUIRED })
    .min(1, V.REQUIRED)
    .max(255, vk(V.MAX_CHARS, { max: 255 })),
  fileExtension: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(10, vk(V.MAX_CHARS, { max: 10 })),
  fileSizeMb: z
    .number()
    .positive(vk(V.FILE_MIN_SIZE, { min: 0 }))
    .max(50, vk(V.FILE_MAX_SIZE, { max: 50 })),
  mimeType: z.literal('application/pdf', { message: V.FILE_PDF_ONLY }),
});
export type CreateCandidateResumeRequest = z.infer<typeof CreateCandidateResumeRequestSchema>;

export const ListCandidateResumesQuerySchema = PaginationQuerySchema.extend({
  candidateId: UuidSchema.optional(),
  applicationId: UuidSchema.optional(),
});
export type ListCandidateResumesQuery = z.infer<typeof ListCandidateResumesQuerySchema>;

// --- Public apply ---

export const ApplyJobVacancyRequestSchema = z.object({
  candidate: z.object({
    nationalId: EcuadorianIdSchema,
    firstName: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
    lastName: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
    email: EmailSchema,
    phone: PhoneSchema,
    address: z.string().max(255, vk(V.ADDRESS_MAX, { max: 255 })).optional(),
  }),
  vacancyId: UuidSchema,
  coverLetter: z.string().max(2000, vk(V.MAX_CHARS, { max: 2000 })).optional(),
});
export type ApplyJobVacancyRequest = z.infer<typeof ApplyJobVacancyRequestSchema>;

export const ApplyJobVacancyFormSchema = CreateCandidateRequestSchema.extend({
  coverLetter: ApplyJobVacancyRequestSchema.shape.coverLetter,
});
export type ApplyJobVacancyForm = z.infer<typeof ApplyJobVacancyFormSchema>;

export const UploadCandidateResumeRequestSchema = z.object({
  candidateId: UuidSchema,
  applicationId: UuidSchema.optional(),
});
export type UploadCandidateResumeRequest = z.infer<typeof UploadCandidateResumeRequestSchema>;
