import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';

// --- Nested reference schemas (not exported) ---

const EmployeeRefSchema = z.object({
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

const SlimEmployeeRefSchema = z.object({
  id: UuidSchema,
  username: z.string(),
  profile: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
});

const ClientRefSchema = z.object({
  id: UuidSchema,
  businessName: z.string(),
  contactName: z.string(),
});

const SlimClientRefSchema = z.object({
  id: UuidSchema,
  businessName: z.string(),
});

const StateRefSchema = z.object({
  id: UuidSchema,
  code: z.string(),
  name: z.string(),
});

const VisitTypeRefSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

// --- Lookup: Negotiation States ---

export const NegotiationStateResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type NegotiationStateResponse = z.infer<typeof NegotiationStateResponseSchema>;

// --- Lookup: Visit Types ---

export const VisitTypeResponseSchema = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type VisitTypeResponse = z.infer<typeof VisitTypeResponseSchema>;

// --- Business Clients ---

export const BusinessClientResponseSchema = z
  .object({
    id: UuidSchema,
    ruc: z.string(),
    businessName: z.string(),
    contactName: z.string(),
    contactPhone: z.string().nullable(),
    contactEmail: z.string().nullable(),
    address: z.string().nullable(),
    activeServicesCount: z.number().int(),
    currentMonthlyBilling: z.number(),
    isActive: z.boolean(),
    advisor: EmployeeRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type BusinessClientResponse = z.infer<typeof BusinessClientResponseSchema>;

export const BusinessClientListItemResponseSchema = z
  .object({
    id: UuidSchema,
    ruc: z.string(),
    businessName: z.string(),
    contactName: z.string(),
    isActive: z.boolean(),
    advisor: SlimEmployeeRefSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type BusinessClientListItemResponse = z.infer<typeof BusinessClientListItemResponseSchema>;

// --- Negotiations ---

export const NegotiationResponseSchema = z
  .object({
    id: UuidSchema,
    startDate: z.string().date().nullable(),
    estimatedCloseDate: z.string().date().nullable(),
    observations: z.string().nullable(),
    isActive: z.boolean(),
    client: ClientRefSchema,
    advisor: EmployeeRefSchema,
    state: StateRefSchema,
  })
  .merge(TimestampsSchema);
export type NegotiationResponse = z.infer<typeof NegotiationResponseSchema>;

export const NegotiationListItemResponseSchema = z
  .object({
    id: UuidSchema,
    startDate: z.string().date().nullable(),
    estimatedCloseDate: z.string().date().nullable(),
    isActive: z.boolean(),
    client: SlimClientRefSchema,
    advisor: SlimEmployeeRefSchema,
    state: StateRefSchema,
  })
  .merge(TimestampsSchema);
export type NegotiationListItemResponse = z.infer<typeof NegotiationListItemResponseSchema>;

// --- Negotiation State History ---

export const NegotiationStateHistoryResponseSchema = z.object({
  id: UuidSchema,
  previousState: StateRefSchema.nullable(),
  newState: StateRefSchema,
  changedBy: SlimEmployeeRefSchema,
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type NegotiationStateHistoryResponse = z.infer<typeof NegotiationStateHistoryResponseSchema>;

// --- Visits ---

export const VisitResponseSchema = z
  .object({
    id: UuidSchema,
    visitDate: z.string().datetime(),
    observations: z.string().nullable(),
    isVerified: z.boolean(),
    supervisorComment: z.string().nullable(),
    gpsLatitude: z.number().nullable(),
    gpsLongitude: z.number().nullable(),
    gpsAccuracy: z.number().nullable(),
    gpsTimestamp: z.string().datetime().nullable(),
    negotiation: z
      .object({
        id: UuidSchema,
        client: SlimClientRefSchema,
      })
      .nullable(),
    client: ClientRefSchema,
    advisor: EmployeeRefSchema,
    verifiedBy: SlimEmployeeRefSchema.nullable(),
    visitType: VisitTypeRefSchema,
  })
  .merge(TimestampsSchema);
export type VisitResponse = z.infer<typeof VisitResponseSchema>;

export const VisitListItemResponseSchema = z
  .object({
    id: UuidSchema,
    visitDate: z.string().datetime(),
    isVerified: z.boolean(),
    client: SlimClientRefSchema,
    advisor: SlimEmployeeRefSchema,
    visitType: VisitTypeRefSchema,
  })
  .merge(TimestampsSchema);
export type VisitListItemResponse = z.infer<typeof VisitListItemResponseSchema>;
