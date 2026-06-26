import { z } from 'zod';
import {
  BooleanQuerySchema,
  EmailSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';

// ============================================================================
// Lookup tables — 7 tables with identical structure
// ============================================================================

const lookupCreate = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(30, 'Máximo 30 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isActive: z.boolean().default(true),
});

const lookupUpdate = z.object({
  code: z.string().min(1, 'El código es obligatorio').max(30, 'Máximo 30 caracteres').optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  isActive: z.boolean().optional(),
});

const lookupListQuery = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: BooleanQuerySchema.optional(),
});

export const CreateItemTypeRequestSchema = lookupCreate;
export type CreateItemTypeRequest = z.infer<typeof CreateItemTypeRequestSchema>;

export const UpdateItemTypeRequestSchema = lookupUpdate;
export type UpdateItemTypeRequest = z.infer<typeof UpdateItemTypeRequestSchema>;

export const ListItemTypesQuerySchema = lookupListQuery;
export type ListItemTypesQuery = z.infer<typeof ListItemTypesQuerySchema>;

export const CreateContractTypeRequestSchema = lookupCreate;
export type CreateContractTypeRequest = z.infer<typeof CreateContractTypeRequestSchema>;

export const UpdateContractTypeRequestSchema = lookupUpdate;
export type UpdateContractTypeRequest = z.infer<typeof UpdateContractTypeRequestSchema>;

export const ListContractTypesQuerySchema = lookupListQuery;
export type ListContractTypesQuery = z.infer<typeof ListContractTypesQuerySchema>;

export const CreateSegmentRequestSchema = lookupCreate;
export type CreateSegmentRequest = z.infer<typeof CreateSegmentRequestSchema>;

export const UpdateSegmentRequestSchema = lookupUpdate;
export type UpdateSegmentRequest = z.infer<typeof UpdateSegmentRequestSchema>;

export const ListSegmentsQuerySchema = lookupListQuery;
export type ListSegmentsQuery = z.infer<typeof ListSegmentsQuerySchema>;

export const CreateTierRequestSchema = lookupCreate;
export type CreateTierRequest = z.infer<typeof CreateTierRequestSchema>;

export const UpdateTierRequestSchema = lookupUpdate;
export type UpdateTierRequest = z.infer<typeof UpdateTierRequestSchema>;

export const ListTiersQuerySchema = lookupListQuery;
export type ListTiersQuery = z.infer<typeof ListTiersQuerySchema>;

export const CreateGeoZoneRequestSchema = lookupCreate;
export type CreateGeoZoneRequest = z.infer<typeof CreateGeoZoneRequestSchema>;

export const UpdateGeoZoneRequestSchema = lookupUpdate;
export type UpdateGeoZoneRequest = z.infer<typeof UpdateGeoZoneRequestSchema>;

export const ListGeoZonesQuerySchema = lookupListQuery;
export type ListGeoZonesQuery = z.infer<typeof ListGeoZonesQuerySchema>;

export const CreateBenefitTypeRequestSchema = lookupCreate;
export type CreateBenefitTypeRequest = z.infer<typeof CreateBenefitTypeRequestSchema>;

export const UpdateBenefitTypeRequestSchema = lookupUpdate;
export type UpdateBenefitTypeRequest = z.infer<typeof UpdateBenefitTypeRequestSchema>;

export const ListBenefitTypesQuerySchema = lookupListQuery;
export type ListBenefitTypesQuery = z.infer<typeof ListBenefitTypesQuerySchema>;

export const CreateContentTypeRequestSchema = lookupCreate;
export type CreateContentTypeRequest = z.infer<typeof CreateContentTypeRequestSchema>;

export const UpdateContentTypeRequestSchema = lookupUpdate;
export type UpdateContentTypeRequest = z.infer<typeof UpdateContentTypeRequestSchema>;

export const ListContentTypesQuerySchema = lookupListQuery;
export type ListContentTypesQuery = z.infer<typeof ListContentTypesQuerySchema>;

// ============================================================================
// Categories (hierarchical)
// ============================================================================

export const CreateCategoryRequestSchema = z.object({
  parentId: UuidSchema.optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

export const UpdateCategoryRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;

export const ListCategoriesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  parentId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
});
export type ListCategoriesQuery = z.infer<typeof ListCategoriesQuerySchema>;

// ============================================================================
// Detail tables (1:1 with catalog_items) — create schemas
// ============================================================================

export const CreateVoiceDetailSchema = z.object({
  gigasStructural: z.number().int('Debe ser un número entero'),
  gigasLoyalty: z.number().int('Debe ser un número entero').default(0),
  minutesNational: z.number().int('Debe ser un número entero').optional(),
  minutesLdi: z.number().int('Debe ser un número entero').default(0),
  sms: z.number().int('Debe ser un número entero').default(0),
  hasUnlimitedMinutes: z.boolean().default(false),
  hasUnlimitedWhatsapp: z.boolean().default(true),
  hasSocialNetworks: z.boolean().default(false),
  includedRoamingGb: z.number().min(0, 'No puede ser negativo').default(0),
});

export const CreateConnectivityDetailSchema = z.object({
  bandwidthMbps: z.number().min(0, 'El ancho de banda no puede ser negativo'),
});

export const CreateDigitalDetailSchema = z.object({
  provider: z.string().min(1, 'El proveedor es obligatorio').max(50, 'Máximo 50 caracteres'),
});

export const CreateRoamingDetailSchema = z.object({
  geoZoneId: UuidSchema,
  dataMb: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser un número entero positivo'),
  durationDays: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser un número entero positivo'),
  hasThrottle: z.boolean().default(false),
});

export const CreateDeviceDetailSchema = z.object({
  brand: z.string().min(1, 'La marca es obligatoria').max(50, 'Máximo 50 caracteres'),
  model: z.string().min(1, 'El modelo es obligatorio').max(50, 'Máximo 50 caracteres'),
  storageGb: z.number().int('Debe ser un número entero').optional(),
  financingMonths: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser un número entero positivo')
    .optional(),
  financingMonthly: z.number().min(0, 'El valor no puede ser negativo').optional(),
});

// ============================================================================
// Item benefits (M:1 with catalog_items)
// ============================================================================

export const CreateItemBenefitSchema = z.object({
  benefitTypeId: UuidSchema,
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
  durationDays: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser un número entero positivo')
    .optional(),
});

// ============================================================================
// Condition tables (1:1 with catalog_items)
// ============================================================================

export const CreateAgeConditionSchema = z.object({
  minAge: z.number().int('Debe ser un número entero').min(0, 'La edad no puede ser negativa'),
  maxAge: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'La edad no puede ser negativa')
    .optional(),
});

export const CreateLegalConditionSchema = z.object({
  legalRequirement: z.string().min(1, 'El requisito legal es obligatorio'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
});

export const CreateTemporalConditionSchema = z.object({
  effectiveDate: z.string(),
  expirationDate: z.string().optional(),
});

// ============================================================================
// Catalog items (core product)
// ============================================================================

export const CreateCatalogItemRequestSchema = z.object({
  categoryId: UuidSchema,
  itemTypeId: UuidSchema,
  contractTypeId: UuidSchema,
  segmentId: UuidSchema,
  tierId: UuidSchema,
  name: z.string().min(1, 'El nombre es obligatorio').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  activationCode: z.string().max(50, 'Máximo 50 caracteres').optional(),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  permanenceMonths: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Los meses de permanencia no pueden ser negativos')
    .default(0),
  voiceDetails: CreateVoiceDetailSchema.optional(),
  connectivityDetails: CreateConnectivityDetailSchema.optional(),
  digitalDetails: CreateDigitalDetailSchema.optional(),
  roamingDetails: CreateRoamingDetailSchema.optional(),
  deviceDetails: CreateDeviceDetailSchema.optional(),
  benefits: z.array(CreateItemBenefitSchema).optional(),
  ageConditions: CreateAgeConditionSchema.optional(),
  legalConditions: CreateLegalConditionSchema.optional(),
  temporalConditions: CreateTemporalConditionSchema.optional(),
});
export type CreateCatalogItemRequest = z.infer<typeof CreateCatalogItemRequestSchema>;

export const UpdateCatalogItemRequestSchema = z.object({
  categoryId: UuidSchema.optional(),
  itemTypeId: UuidSchema.optional(),
  contractTypeId: UuidSchema.optional(),
  segmentId: UuidSchema.optional(),
  tierId: UuidSchema.optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(200, 'Máximo 200 caracteres').optional(),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  price: z.number().min(0, 'El precio no puede ser negativo').optional(),
  activationCode: z.string().max(50, 'Máximo 50 caracteres').optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  permanenceMonths: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Los meses de permanencia no pueden ser negativos')
    .optional(),
  voiceDetails: CreateVoiceDetailSchema.optional(),
  connectivityDetails: CreateConnectivityDetailSchema.optional(),
  digitalDetails: CreateDigitalDetailSchema.optional(),
  roamingDetails: CreateRoamingDetailSchema.optional(),
  deviceDetails: CreateDeviceDetailSchema.optional(),
  benefits: z.array(CreateItemBenefitSchema).optional(),
  ageConditions: CreateAgeConditionSchema.optional(),
  legalConditions: CreateLegalConditionSchema.optional(),
  temporalConditions: CreateTemporalConditionSchema.optional(),
});
export type UpdateCatalogItemRequest = z.infer<typeof UpdateCatalogItemRequestSchema>;

export const ListPublicCatalogQuerySchema = z.object({
  categoryId: UuidSchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});
export type ListPublicCatalogQuery = z.infer<typeof ListPublicCatalogQuerySchema>;

export const ListCatalogItemsQuerySchema = PaginationQuerySchema.extend({
  categoryId: UuidSchema.optional(),
  itemTypeId: UuidSchema.optional(),
  isActive: BooleanQuerySchema.optional(),
  isPublished: BooleanQuerySchema.optional(),
  search: z.string().optional(),
});
export type ListCatalogItemsQuery = z.infer<typeof ListCatalogItemsQuerySchema>;

// ============================================================================
// Content blocks (CMS)
// ============================================================================

export const CreateContentBlockRequestSchema = z.object({
  contentKey: z.string().min(1, 'La clave es obligatoria').max(100, 'Máximo 100 caracteres'),
  contentTypeId: UuidSchema,
  title: z.string().max(200, 'Máximo 200 caracteres').optional(),
  body: z.string().max(10000, 'Máximo 10000 caracteres').optional(),
  sortOrder: z.number().int().default(0),
});
export type CreateContentBlockRequest = z.infer<typeof CreateContentBlockRequestSchema>;

export const UpdateContentBlockRequestSchema = z.object({
  contentKey: z
    .string()
    .min(1, 'La clave es obligatoria')
    .max(100, 'Máximo 100 caracteres')
    .optional(),
  contentTypeId: UuidSchema.optional(),
  title: z.string().max(200, 'Máximo 200 caracteres').optional(),
  body: z.string().max(10000, 'Máximo 10000 caracteres').optional(),
  sortOrder: z.number().int().optional(),
});
export type UpdateContentBlockRequest = z.infer<typeof UpdateContentBlockRequestSchema>;

export const ListContentBlocksQuerySchema = PaginationQuerySchema.extend({
  contentTypeId: UuidSchema.optional(),
  search: z.string().optional(),
});
export type ListContentBlocksQuery = z.infer<typeof ListContentBlocksQuerySchema>;

// ============================================================================
// Contact requests (public inquiries)
// ============================================================================

export const CreateContactRequestSchema = z.object({
  itemId: UuidSchema.optional(),
  clientName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  clientEmail: EmailSchema,
  clientPhone: PhoneSchema.optional(),
  message: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
export type CreateContactRequest = z.infer<typeof CreateContactRequestSchema>;

export const UpdateContactRequestSchema = z.object({
  isAttended: z.boolean().optional(),
});
export type UpdateContactRequest = z.infer<typeof UpdateContactRequestSchema>;

export const ListContactRequestsQuerySchema = PaginationQuerySchema.extend({
  itemId: UuidSchema.optional(),
  isAttended: BooleanQuerySchema.optional(),
  search: z.string().optional(),
});
export type ListContactRequestsQuery = z.infer<typeof ListContactRequestsQuerySchema>;
