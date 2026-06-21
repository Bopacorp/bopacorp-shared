import { z } from 'zod';
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
  firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(50, 'Máximo 50 caracteres'),
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  address: z.string().max(255, 'La dirección no puede exceder 255 caracteres').optional(),
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
  title: z.string().min(1, 'El título es obligatorio').max(255, 'Máximo 255 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  requirements: z.string().min(1, 'Los requisitos son obligatorios'),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  publicationDate: z.string().datetime('La fecha de publicación no es válida').optional(),
  closingDate: z.string().datetime('La fecha de cierre no es válida').optional(),
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
  coverLetter: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});
export type CreateJobApplicationRequest = z.infer<typeof CreateJobApplicationRequestSchema>;

export const UpdateJobApplicationRequestSchema = z.object({
  state: ApplicationStateSchema.optional(),
  reviewNotes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
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
    .string()
    .min(1, 'El nombre del archivo es obligatorio')
    .max(255, 'Máximo 255 caracteres'),
  fileExtension: z.string().min(1, 'La extensión es obligatoria').max(10, 'Máximo 10 caracteres'),
  fileSizeMb: z
    .number()
    .positive('El archivo debe pesar más de 0 MB')
    .max(50, 'El archivo debe pesar menos de 50 MB'),
  mimeType: z.string().min(1, 'El tipo MIME es obligatorio').max(100, 'Máximo 100 caracteres'),
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
    firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
    lastName: z.string().min(1, 'El apellido es obligatorio').max(50, 'Máximo 50 caracteres'),
    email: EmailSchema,
    phone: PhoneSchema.optional(),
    address: z.string().max(255, 'La dirección no puede exceder 255 caracteres').optional(),
  }),
  vacancyId: UuidSchema,
  coverLetter: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});
export type ApplyJobVacancyRequest = z.infer<typeof ApplyJobVacancyRequestSchema>;

export const UploadCandidateResumeRequestSchema = z.object({
  candidateId: UuidSchema,
  applicationId: UuidSchema.optional(),
});
export type UploadCandidateResumeRequest = z.infer<typeof UploadCandidateResumeRequestSchema>;
