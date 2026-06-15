import { z } from 'zod';
import { BooleanQuerySchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

export const CreateNotificationRequestSchema = z.object({
  recipientId: UuidSchema,
  title: z.string().max(200),
  message: z.string(),
  referenceType: z.string().max(50).optional(),
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
