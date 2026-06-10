import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

// --- Lookup: Negotiation States ---

export const CreateNegotiationStateRequestSchema = z.object({
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
});
export type CreateNegotiationStateRequest = z.infer<typeof CreateNegotiationStateRequestSchema>;

export const UpdateNegotiationStateRequestSchema = CreateNegotiationStateRequestSchema.partial();
export type UpdateNegotiationStateRequest = z.infer<typeof UpdateNegotiationStateRequestSchema>;

export const ListNegotiationStatesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListNegotiationStatesQuery = z.infer<typeof ListNegotiationStatesQuerySchema>;

// --- Lookup: Visit Types ---

export const CreateVisitTypeRequestSchema = z.object({
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
});
export type CreateVisitTypeRequest = z.infer<typeof CreateVisitTypeRequestSchema>;

export const UpdateVisitTypeRequestSchema = CreateVisitTypeRequestSchema.partial();
export type UpdateVisitTypeRequest = z.infer<typeof UpdateVisitTypeRequestSchema>;

export const ListVisitTypesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListVisitTypesQuery = z.infer<typeof ListVisitTypesQuerySchema>;

// --- Business Clients ---

export const CreateBusinessClientRequestSchema = z.object({
  advisorId: UuidSchema.optional(),
  ruc: z.string().length(13).regex(/^[0-9]+$/),
  businessName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().max(150).optional(),
  address: z.string().optional(),
  activeServicesCount: z.number().int().min(0).default(0),
  currentMonthlyBilling: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});
export type CreateBusinessClientRequest = z.infer<typeof CreateBusinessClientRequestSchema>;

export const UpdateBusinessClientRequestSchema = CreateBusinessClientRequestSchema.partial();
export type UpdateBusinessClientRequest = z.infer<typeof UpdateBusinessClientRequestSchema>;

export const ListBusinessClientsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  advisorId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListBusinessClientsQuery = z.infer<typeof ListBusinessClientsQuerySchema>;

// --- Negotiations ---

export const CreateNegotiationRequestSchema = z.object({
  clientId: UuidSchema,
  advisorId: UuidSchema,
  stateId: UuidSchema,
  startDate: z.string().date().optional(),
  estimatedCloseDate: z.string().date().optional(),
  observations: z.string().optional(),
  isActive: z.boolean().default(true),
});
export type CreateNegotiationRequest = z.infer<typeof CreateNegotiationRequestSchema>;

export const UpdateNegotiationRequestSchema = CreateNegotiationRequestSchema.partial();
export type UpdateNegotiationRequest = z.infer<typeof UpdateNegotiationRequestSchema>;

export const ChangeNegotiationStateRequestSchema = z.object({
  stateId: UuidSchema,
  notes: z.string().optional(),
});
export type ChangeNegotiationStateRequest = z.infer<typeof ChangeNegotiationStateRequestSchema>;

export const ListNegotiationsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  clientId: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  stateId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListNegotiationsQuery = z.infer<typeof ListNegotiationsQuerySchema>;

// --- Visits ---

export const CreateVisitRequestSchema = z.object({
  negotiationId: UuidSchema.optional(),
  clientId: UuidSchema,
  advisorId: UuidSchema,
  visitTypeId: UuidSchema,
  visitDate: z.string().datetime(),
  observations: z.string().optional(),
  gpsLatitude: z.number().optional(),
  gpsLongitude: z.number().optional(),
  gpsAccuracy: z.number().optional(),
  gpsTimestamp: z.string().datetime().optional(),
});
export type CreateVisitRequest = z.infer<typeof CreateVisitRequestSchema>;

export const UpdateVisitRequestSchema = CreateVisitRequestSchema.partial();
export type UpdateVisitRequest = z.infer<typeof UpdateVisitRequestSchema>;

export const VerifyVisitRequestSchema = z.object({
  supervisorComment: z.string().optional(),
  isVerified: z.boolean().default(true),
});
export type VerifyVisitRequest = z.infer<typeof VerifyVisitRequestSchema>;

export const ListVisitsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  clientId: UuidSchema.optional(),
  advisorId: UuidSchema.optional(),
  visitTypeId: UuidSchema.optional(),
  isVerified: z.coerce.boolean().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type ListVisitsQuery = z.infer<typeof ListVisitsQuerySchema>;
