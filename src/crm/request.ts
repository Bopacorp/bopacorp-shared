import { z } from 'zod';
import {
  BooleanQuerySchema,
  EmailSchema,
  PaginationQuerySchema,
  PhoneSchema,
  RucSchema,
  UuidSchema,
} from '../common/primitives.js';

// --- Lookup: Negotiation States ---

export const CreateNegotiationStateRequestSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(30, 'Máximo 30 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isActive: z.boolean().default(true),
});
export type CreateNegotiationStateRequest = z.infer<typeof CreateNegotiationStateRequestSchema>;

export const UpdateNegotiationStateRequestSchema = CreateNegotiationStateRequestSchema.partial();
export type UpdateNegotiationStateRequest = z.infer<typeof UpdateNegotiationStateRequestSchema>;

export const ListNegotiationStatesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListNegotiationStatesQuery = z.infer<typeof ListNegotiationStatesQuerySchema>;

// --- Lookup: Visit Types ---

export const CreateVisitTypeRequestSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(30, 'Máximo 30 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isActive: z.boolean().default(true),
});
export type CreateVisitTypeRequest = z.infer<typeof CreateVisitTypeRequestSchema>;

export const UpdateVisitTypeRequestSchema = CreateVisitTypeRequestSchema.partial();
export type UpdateVisitTypeRequest = z.infer<typeof UpdateVisitTypeRequestSchema>;

export const ListVisitTypesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListVisitTypesQuery = z.infer<typeof ListVisitTypesQuerySchema>;

// --- Business Clients ---

export const CreateBusinessClientRequestSchema = z.object({
  advisorId: UuidSchema.optional(),
  ruc: RucSchema,
  businessName: z
    .string()
    .min(1, 'La razón social es obligatoria')
    .max(200, 'Máximo 200 caracteres'),
  contactName: z
    .string()
    .min(1, 'El nombre del contacto es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  contactPhone: PhoneSchema.optional(),
  contactEmail: EmailSchema.optional(),
  address: z.string().max(255, 'La dirección no puede exceder 255 caracteres').optional(),
  activeServicesCount: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'El número de servicios no puede ser negativo')
    .default(0),
  currentMonthlyBilling: z.number().min(0, 'La facturación no puede ser negativa').default(0),
  isActive: z.boolean().default(true),
});
export type CreateBusinessClientRequest = z.infer<typeof CreateBusinessClientRequestSchema>;

export const UpdateBusinessClientRequestSchema = CreateBusinessClientRequestSchema.partial();
export type UpdateBusinessClientRequest = z.infer<typeof UpdateBusinessClientRequestSchema>;

export const ListBusinessClientsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  advisorId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListBusinessClientsQuery = z.infer<typeof ListBusinessClientsQuerySchema>;

// --- Negotiations ---

export const CreateNegotiationRequestSchema = z.object({
  clientId: UuidSchema,
  advisorId: UuidSchema,
  stateId: UuidSchema,
  startDate: z.string().date('La fecha de inicio no es válida').optional(),
  estimatedCloseDate: z.string().date('La fecha estimada de cierre no es válida').optional(),
  observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  isActive: z.boolean().default(true),
});
export type CreateNegotiationRequest = z.infer<typeof CreateNegotiationRequestSchema>;

export const UpdateNegotiationRequestSchema = CreateNegotiationRequestSchema.partial();
export type UpdateNegotiationRequest = z.infer<typeof UpdateNegotiationRequestSchema>;

export const ChangeNegotiationStateRequestSchema = z.object({
  stateId: UuidSchema,
  notes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
export type ChangeNegotiationStateRequest = z.infer<typeof ChangeNegotiationStateRequestSchema>;

export const ListNegotiationsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  clientId: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  stateId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListNegotiationsQuery = z.infer<typeof ListNegotiationsQuerySchema>;

// --- Visits ---

export const CreateVisitRequestSchema = z.object({
  negotiationId: UuidSchema.optional(),
  clientId: UuidSchema,
  advisorId: UuidSchema,
  visitTypeId: UuidSchema,
  visitDate: z.string().datetime('La fecha de visita no es válida'),
  observations: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  gpsLatitude: z.number().optional(),
  gpsLongitude: z.number().optional(),
  gpsAccuracy: z.number().optional(),
  gpsTimestamp: z.string().datetime('La fecha GPS no es válida').optional(),
});
export type CreateVisitRequest = z.infer<typeof CreateVisitRequestSchema>;

export const UpdateVisitRequestSchema = CreateVisitRequestSchema.partial();
export type UpdateVisitRequest = z.infer<typeof UpdateVisitRequestSchema>;

export const VerifyVisitRequestSchema = z.object({
  supervisorComment: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  isVerified: z.boolean().default(true),
});
export type VerifyVisitRequest = z.infer<typeof VerifyVisitRequestSchema>;

export const ListVisitsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  clientId: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  visitTypeId: UuidSchema.optional(),
  isVerified: BooleanQuerySchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type ListVisitsQuery = z.infer<typeof ListVisitsQuerySchema>;
