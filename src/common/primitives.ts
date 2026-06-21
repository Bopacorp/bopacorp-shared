import { z } from 'zod';

export const UuidSchema = z.uuid();

export const EmailSchema = z
  .email('Correo electrónico no válido')
  .max(150, 'El correo no puede exceder 150 caracteres');

export const IpAddressSchema = z.string().max(45);

export const UserAgentSchema = z.string().max(500);

export const BooleanQuerySchema = z
  .enum(['true', 'false'], { message: 'El valor debe ser true o false' })
  .transform((v) => v === 'true')
  .pipe(z.boolean());

export const PaginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int('La página debe ser un número entero')
    .min(1, 'La página mínima es 1')
    .default(1),
  limit: z.coerce
    .number()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite mínimo es 1')
    .max(100, 'El límite máximo es 100')
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
  .length(10, 'La cédula debe tener 10 dígitos')
  .regex(/^\d{10}$/, 'La cédula solo debe contener números');
export type EcuadorianId = z.infer<typeof EcuadorianIdSchema>;

export const RucSchema = z
  .string()
  .length(13, 'El RUC debe tener 13 dígitos')
  .regex(/^\d{13}$/, 'El RUC solo debe contener números');
export type Ruc = z.infer<typeof RucSchema>;

export const NationalIdSchema = z
  .string()
  .min(10, 'El documento debe tener al menos 10 dígitos')
  .max(13, 'El documento debe tener máximo 13 dígitos')
  .regex(/^\d+$/, 'El documento solo debe contener números');
export type NationalId = z.infer<typeof NationalIdSchema>;

export const PhoneSchema = z
  .string()
  .min(9, 'El teléfono debe tener al menos 9 dígitos')
  .max(10, 'El teléfono debe tener máximo 10 dígitos')
  .regex(/^\d{9,10}$/, 'El teléfono solo debe contener números');
export type Phone = z.infer<typeof PhoneSchema>;
