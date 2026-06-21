import { z } from 'zod';
import { BooleanQuerySchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

export const CreateNotificationRequestSchema = z.object({
  recipientId: UuidSchema,
  title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  message: z.string().min(1, 'El mensaje es obligatorio'),
  referenceType: z.string().max(50, 'Máximo 50 caracteres').optional(),
  referenceId: UuidSchema.optional(),
});
export type CreateNotificationRequest = z.infer<typeof CreateNotificationRequestSchema>;

export const UpdateNotificationRequestSchema = z.object({
  isRead: z.boolean(),
});
export type UpdateNotificationRequest = z.infer<typeof UpdateNotificationRequestSchema>;

export const ListNotificationsQuerySchema = PaginationQuerySchema.extend({
  recipientId: UuidSchema.optional(),
  isRead: BooleanQuerySchema.optional(),
});
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;
