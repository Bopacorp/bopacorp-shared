import { z } from 'zod';
import {
  BooleanQuerySchema,
  EmailSchema,
  PaginationQuerySchema,
  PhoneSchema,
  UuidSchema,
} from '../common/primitives.js';
import { V, vk } from '../i18n/keys.js';

// ============================================================================
// Lookup tables — 7 tables with identical structure
// ============================================================================

const lookupCreate = z.object({
  code: z.string().min(1, V.REQUIRED).max(30, vk(V.MAX_CHARS, { max: 30 })),
  name: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  isActive: z.boolean().default(true),
});

const lookupUpdate = z.object({
  code: z.string().min(1, V.REQUIRED).max(30, vk(V.MAX_CHARS, { max: 30 })).optional(),
  name: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })).optional(),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
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
  name: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  slug: z
    .string()
    .min(1, V.REQUIRED)
    .max(120, vk(V.MAX_CHARS, { max: 120 }))
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, V.SLUG_PATTERN),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

export const UpdateCategoryRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })).optional(),
  slug: z
    .string()
    .min(1, V.REQUIRED)
    .max(120, vk(V.MAX_CHARS, { max: 120 }))
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, V.SLUG_PATTERN)
    .optional(),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
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
  gigasStructural: z.number({ error: V.REQUIRED }).int(V.INTEGER),
  gigasLoyalty: z.number().int(V.INTEGER).default(0),
  minutesNational: z.number().int(V.INTEGER).optional(),
  minutesLdi: z.number().int(V.INTEGER).default(0),
  sms: z.number().int(V.INTEGER).default(0),
  hasUnlimitedMinutes: z.boolean().default(false),
  hasUnlimitedWhatsapp: z.boolean().default(true),
  hasSocialNetworks: z.boolean().default(false),
  includedRoamingGb: z.number().min(0, V.NON_NEGATIVE).default(0),
});

export const CreateConnectivityDetailSchema = z.object({
  bandwidthMbps: z.number({ error: V.REQUIRED }).min(0, V.NON_NEGATIVE),
});

export const CreateDigitalDetailSchema = z.object({
  provider: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
});

export const CreateRoamingDetailSchema = z.object({
  geoZoneId: UuidSchema,
  dataMb: z
    .number()
    .int(V.INTEGER)
    .positive(V.POSITIVE),
  durationDays: z
    .number()
    .int(V.INTEGER)
    .positive(V.POSITIVE),
  hasThrottle: z.boolean().default(false),
});

export const CreateDeviceDetailSchema = z.object({
  brand: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  model: z.string().min(1, V.REQUIRED).max(50, vk(V.MAX_CHARS, { max: 50 })),
  storageGb: z.number().int(V.INTEGER).optional(),
  financingMonths: z
    .number()
    .int(V.INTEGER)
    .positive(V.POSITIVE)
    .optional(),
  financingMonthly: z.number().min(0, V.NON_NEGATIVE).optional(),
});

// ============================================================================
// Item benefits (M:1 with catalog_items)
// ============================================================================

export const CreateItemBenefitSchema = z.object({
  benefitTypeId: UuidSchema,
  name: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
  durationDays: z
    .number()
    .int(V.INTEGER)
    .positive(V.POSITIVE)
    .optional(),
});

// ============================================================================
// Condition tables (1:1 with catalog_items)
// ============================================================================

export const CreateAgeConditionSchema = z.object({
  minAge: z.number({ error: V.REQUIRED }).int(V.INTEGER).min(0, V.NON_NEGATIVE),
  maxAge: z
    .number()
    .int(V.INTEGER)
    .min(0, V.NON_NEGATIVE)
    .optional(),
});

export const CreateLegalConditionSchema = z.object({
  legalRequirement: z.string().min(1, V.REQUIRED),
  description: z.string().max(255, vk(V.MAX_CHARS, { max: 255 })).optional(),
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
  name: z.string().min(1, V.REQUIRED).max(200, vk(V.MAX_CHARS, { max: 200 })),
  description: z.string().min(1, V.REQUIRED).max(1000, vk(V.MAX_CHARS, { max: 1000 })),
  price: z.number({ error: V.REQUIRED }).min(0, V.NON_NEGATIVE),
  activationCode: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  permanenceMonths: z
    .number()
    .int(V.INTEGER)
    .min(0, V.PERMANENCE_NON_NEGATIVE)
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
  name: z.string().min(1, V.REQUIRED).max(200, vk(V.MAX_CHARS, { max: 200 })).optional(),
  description: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
  price: z.number().min(0, V.NON_NEGATIVE).optional(),
  activationCode: z.string().max(50, vk(V.MAX_CHARS, { max: 50 })).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  permanenceMonths: z
    .number()
    .int(V.INTEGER)
    .min(0, V.PERMANENCE_NON_NEGATIVE)
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
  categorySlug: z.string().max(120).optional(),
  segmentId: UuidSchema.optional(),
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
  contentKey: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  contentTypeId: UuidSchema,
  title: z.string().max(200, vk(V.MAX_CHARS, { max: 200 })).optional(),
  body: z.string().max(10000, vk(V.MAX_CHARS, { max: 10000 })).optional(),
  sortOrder: z.number().int().default(0),
});
export type CreateContentBlockRequest = z.infer<typeof CreateContentBlockRequestSchema>;

export const UpdateContentBlockRequestSchema = z.object({
  contentKey: z
    .string()
    .min(1, V.REQUIRED)
    .max(100, vk(V.MAX_CHARS, { max: 100 }))
    .optional(),
  contentTypeId: UuidSchema.optional(),
  title: z.string().max(200, vk(V.MAX_CHARS, { max: 200 })).optional(),
  body: z.string().max(10000, vk(V.MAX_CHARS, { max: 10000 })).optional(),
  sortOrder: z.number().int().optional(),
});
export type UpdateContentBlockRequest = z.infer<typeof UpdateContentBlockRequestSchema>;

export const ListContentBlocksQuerySchema = PaginationQuerySchema.extend({
  contentTypeId: UuidSchema.optional(),
  search: z.string().optional(),
  section: z.string().max(50).optional(),
});
export type ListContentBlocksQuery = z.infer<typeof ListContentBlocksQuerySchema>;

// ============================================================================
// Contact requests (public inquiries)
// ============================================================================

export const CreateContactRequestSchema = z.object({
  itemId: UuidSchema.optional(),
  clientName: z.string().min(1, V.REQUIRED).max(100, vk(V.MAX_CHARS, { max: 100 })),
  clientEmail: EmailSchema,
  clientPhone: PhoneSchema.optional(),
  message: z.string().max(1000, vk(V.MAX_CHARS, { max: 1000 })).optional(),
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
