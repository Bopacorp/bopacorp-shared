import { z } from 'zod';
import { V, vk } from '../i18n/keys.js';

export const UuidSchema = z.uuid({
  error: (iss) => {
    if (iss.code === 'invalid_type' || iss.input === '') return V.REQUIRED;
    return V.UUID_INVALID;
  },
});

export const EmailSchema = z
  .email(V.EMAIL_INVALID)
  .max(150, vk(V.EMAIL_MAX, { max: 150 }));

export const CorporateEmailSchema = EmailSchema.refine(
  (v) => v.endsWith('@bopacorp.com'),
  V.EMAIL_CORPORATE_ONLY
);

export const IpAddressSchema = z.string().max(45);

export const UserAgentSchema = z.string().max(500);

export const BooleanQuerySchema = z
  .enum(['true', 'false'], { message: V.BOOLEAN_INVALID })
  .transform((v) => v === 'true')
  .pipe(z.boolean());

export const PaginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int(V.PAGINATION_PAGE_INT)
    .min(1, vk(V.PAGINATION_PAGE_MIN, { min: 1 }))
    .default(1),
  limit: z.coerce
    .number()
    .int(V.PAGINATION_LIMIT_INT)
    .min(1, vk(V.PAGINATION_LIMIT_MIN, { min: 1 }))
    .max(100, vk(V.PAGINATION_LIMIT_MAX, { max: 100 }))
    .default(20),
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

export const EcuadorianIdSchema = z
  .string()
  .length(10, vk(V.CEDULA_LENGTH, { length: 10 }))
  .regex(/^\d{10}$/, V.CEDULA_DIGITS);
export type EcuadorianId = z.infer<typeof EcuadorianIdSchema>;

export const RucSchema = z
  .string()
  .length(13, vk(V.RUC_LENGTH, { length: 13 }))
  .regex(/^\d{13}$/, V.RUC_DIGITS);
export type Ruc = z.infer<typeof RucSchema>;

export const NationalIdSchema = z
  .string()
  .min(10, vk(V.NATIONAL_ID_MIN, { min: 10 }))
  .max(13, vk(V.NATIONAL_ID_MAX, { max: 13 }))
  .regex(/^\d+$/, V.NATIONAL_ID_DIGITS);
export type NationalId = z.infer<typeof NationalIdSchema>;

export const PhoneSchema = z
  .string()
  .min(9, vk(V.PHONE_MIN, { min: 9 }))
  .max(10, vk(V.PHONE_MAX, { max: 10 }))
  .regex(/^\d{9,10}$/, V.PHONE_DIGITS);
export type Phone = z.infer<typeof PhoneSchema>;
