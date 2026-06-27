import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';
import { BooleanQuerySchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

export const CreateNotificationRequestSchema = z.object({
  recipientId: UuidSchema,
  title: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED).max(200, vk(V.MAX_CHARS, { max: 200 })),
  message: z.string({ error: V.REQUIRED }).min(1, V.REQUIRED),
  referenceType: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
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
