import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  secondName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  secondLastName: z.string().max(100).optional(),
  nationalId: z.string().min(1).max(20).optional(),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  address: z.string().optional(),
});
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const AssignAdvisorSupervisorsRequestSchema = z.object({
  supervisorIds: z.array(UuidSchema).min(1),
});
export type AssignAdvisorSupervisorsRequest = z.infer<typeof AssignAdvisorSupervisorsRequestSchema>;

export const ListAdvisorSupervisorsQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
});
export type ListAdvisorSupervisorsQuery = z.infer<typeof ListAdvisorSupervisorsQuerySchema>;
