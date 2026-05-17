import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';

export const ProfileResponseSchema = z.object({
  id: UuidSchema,
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  secondLastName: z.string().nullable(),
  nationalId: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  employeeCode: z.string().nullable(),
  address: z.string().nullable(),
});
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

export const AdvisorSupervisorResponseSchema = z.object({
  advisorId: UuidSchema,
  supervisorId: UuidSchema,
  isActive: z.boolean(),
  assignedAt: z.string().datetime(),
  advisor: z.object({
    id: UuidSchema,
    username: z.string(),
    email: z.string(),
  }),
  supervisor: z.object({
    id: UuidSchema,
    username: z.string(),
    email: z.string(),
  }),
}).merge(TimestampsSchema);
export type AdvisorSupervisorResponse = z.infer<typeof AdvisorSupervisorResponseSchema>;
