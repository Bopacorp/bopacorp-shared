import { describe, expect, it } from 'vitest';
import * as Notifications from '../src/notifications/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};

describe('notification contracts', () => {
  it('validates creation, references and read updates', () => {
    expect(
      Notifications.CreateNotificationRequestSchema.safeParse({
        recipientId: uuid,
        title: 'New visit',
        message: 'A visit was created',
        referenceType: 'visit',
        referenceId: secondUuid,
      }).success
    ).toBe(true);
    expect(Notifications.CreateNotificationRequestSchema.safeParse({ recipientId: uuid, title: '', message: 'Message' }).success).toBe(
      false
    );
    expect(Notifications.UpdateNotificationRequestSchema.safeParse({ isRead: true }).success).toBe(true);
    expect(Notifications.UpdateNotificationRequestSchema.safeParse({ isRead: 'true' }).success).toBe(false);
  });

  it('coerces notification filters and validates UUIDs', () => {
    expect(Notifications.ListNotificationsQuerySchema.parse({ recipientId: uuid, isRead: 'false' })).toMatchObject({
      recipientId: uuid,
      isRead: false,
    });
    expect(Notifications.ListNotificationsQuerySchema.safeParse({ recipientId: 'bad' }).success).toBe(false);
  });

  it('validates full and slim notification responses with nullable read fields', () => {
    expect(
      Notifications.NotificationResponseSchema.safeParse({
        id: uuid,
        title: 'New visit',
        message: 'A visit was created',
        referenceType: 'visit',
        referenceId: secondUuid,
        isRead: false,
        readAt: null,
        recipient: {
          id: secondUuid,
          username: 'ana.perez',
          email: 'ana@example.com',
          profile: null,
        },
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Notifications.NotificationListItemResponseSchema.safeParse({
        id: uuid,
        title: 'New visit',
        message: 'A visit was created',
        isRead: true,
        readAt: '2026-08-15T13:00:00.000Z',
        createdAt: timestamps.createdAt,
        recipient: { id: secondUuid, username: 'ana.perez' },
      }).success
    ).toBe(true);
    expect(
      Notifications.NotificationListItemResponseSchema.safeParse({
        id: uuid,
        title: 'New visit',
        message: 'x'.repeat(101),
        isRead: false,
        readAt: null,
        createdAt: timestamps.createdAt,
        recipient: { id: secondUuid, username: 'ana.perez' },
      }).success
    ).toBe(false);
  });
});
