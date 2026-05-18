import { z } from 'zod';
import { EmailSchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';
import { ApplicationStateSchema } from './enums.js';

export const CreateCandidateRequestSchema = z.object({
  nationalId: z.string().min(1).max(20),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: EmailSchema,
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
});
export type CreateCandidateRequest = z.infer<typeof CreateCandidateRequestSchema>;

export const UpdateCandidateRequestSchema = CreateCandidateRequestSchema.partial();
export type UpdateCandidateRequest = z.infer<typeof UpdateCandidateRequestSchema>;

export const ListCandidatesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
});
export type ListCandidatesQuery = z.infer<typeof ListCandidatesQuerySchema>;

export const CreateJobVacancyRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  requirements: z.string().min(1),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  publicationDate: z.string().datetime().optional(),
  closingDate: z.string().datetime().optional(),
});
export type CreateJobVacancyRequest = z.infer<typeof CreateJobVacancyRequestSchema>;

export const UpdateJobVacancyRequestSchema = CreateJobVacancyRequestSchema.partial();
export type UpdateJobVacancyRequest = z.infer<typeof UpdateJobVacancyRequestSchema>;

export const ListJobVacanciesQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
export type ListJobVacanciesQuery = z.infer<typeof ListJobVacanciesQuerySchema>;

export const CreateJobApplicationRequestSchema = z.object({
  vacancyId: UuidSchema,
  candidateId: UuidSchema,
  coverLetter: z.string().optional(),
});
export type CreateJobApplicationRequest = z.infer<typeof CreateJobApplicationRequestSchema>;

export const UpdateJobApplicationRequestSchema = z.object({
  state: ApplicationStateSchema.optional(),
  reviewNotes: z.string().optional(),
});
export type UpdateJobApplicationRequest = z.infer<typeof UpdateJobApplicationRequestSchema>;

export const ListJobApplicationsQuerySchema = PaginationQuerySchema.extend({
  vacancyId: UuidSchema.optional(),
  candidateId: UuidSchema.optional(),
  state: ApplicationStateSchema.optional(),
  reviewedBy: UuidSchema.optional(),
});
export type ListJobApplicationsQuery = z.infer<typeof ListJobApplicationsQuerySchema>;

export const CreateCandidateResumeRequestSchema = z.object({
  candidateId: UuidSchema,
  applicationId: UuidSchema.optional(),
  filename: z.string().min(1).max(255),
  fileExtension: z.string().min(1).max(10),
  fileSizeMb: z.number().positive().max(50),
  mimeType: z.string().min(1).max(100),
});
export type CreateCandidateResumeRequest = z.infer<typeof CreateCandidateResumeRequestSchema>;

export const ListCandidateResumesQuerySchema = PaginationQuerySchema.extend({
  candidateId: UuidSchema.optional(),
  applicationId: UuidSchema.optional(),
});
export type ListCandidateResumesQuery = z.infer<typeof ListCandidateResumesQuerySchema>;
