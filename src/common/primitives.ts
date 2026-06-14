import { z } from 'zod';

export const UuidSchema = z.uuid();

export const EmailSchema = z.email().max(150);

export const IpAddressSchema = z.string().max(45);

export const UserAgentSchema = z.string().max(500);

export const BooleanQuerySchema = z
  .enum(['true', 'false'])
  .transform((v) => v === 'true')
  .pipe(z.boolean());

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  totalItems: z.number().int(),
  totalPages: z.number().int(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const TimestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Timestamps = z.infer<typeof TimestampsSchema>;
