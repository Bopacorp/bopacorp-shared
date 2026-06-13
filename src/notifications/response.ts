import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';

const UserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  email: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
});

const SlimUserRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
});

export const NotificationResponseSchema = z
  .object({
    id: UuidSchema,
    title: z.string(),
    message: z.string(),
    referenceType: z.string().nullable(),
    referenceId: z.string().nullable(),
    isRead: z.boolean(),
    readAt: z.string().datetime().nullable(),
    recipient: UserRefSchema,
  })
  .merge(TimestampsSchema);
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;

export const NotificationListItemResponseSchema = z.object({
  id: UuidSchema,
  title: z.string(),
  message: z.string().max(100),
  isRead: z.boolean(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  recipient: SlimUserRefSchema,
});
export type NotificationListItemResponse = z.infer<typeof NotificationListItemResponseSchema>;
