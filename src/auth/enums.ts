import { z } from 'zod';

export const PermissionTypeSchema = z.enum([
  'crud',
  'action',
  'report',
  'view',
  'approval',
]);
export type PermissionType = z.infer<typeof PermissionTypeSchema>;

export const TokenTypeSchema = z.enum([
  'refresh',
  'password_reset',
  'email_verify',
]);
export type TokenType = z.infer<typeof TokenTypeSchema>;

export const LoginStatusSchema = z.enum([
  'success',
  'failed',
  'locked',
]);
export type LoginStatus = z.infer<typeof LoginStatusSchema>;

export const AuditOperationSchema = z.enum(['I', 'U', 'D']);
export type AuditOperation = z.infer<typeof AuditOperationSchema>;
