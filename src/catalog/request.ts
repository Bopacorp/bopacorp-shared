import { z } from 'zod';
import { EmailSchema, PaginationQuerySchema, UuidSchema } from '../common/primitives.js';

const lookupCreate = z.object({
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
});

const lookupUpdate = z.object({
  code: z.string().min(1).max(30).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

const lookupListQuery = PaginationQuerySchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
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

export const CreateCategoryRequestSchema = z.object({
  parentId: UuidSchema.optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

export const UpdateCategoryRequestSchema = z.object({
  parentId: UuidSchema.nullable().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;

export const ListCategoriesQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  parentId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListCategoriesQuery = z.infer<typeof ListCategoriesQuerySchema>;

export const CreateVoiceDetailSchema = z.object({
  gigasStructural: z.number().int(),
  gigasLoyalty: z.number().int().default(0),
  minutesNational: z.number().int().optional(),
  minutesLdi: z.number().int().default(0),
  sms: z.number().int().default(0),
  hasUnlimitedMinutes: z.boolean().default(false),
  hasUnlimitedWhatsapp: z.boolean().default(true),
  hasSocialNetworks: z.boolean().default(false),
  includedRoamingGb: z.number().default(0),
});

export const CreateConnectivityDetailSchema = z.object({
  bandwidthMbps: z.number().min(0),
});

export const CreateDigitalDetailSchema = z.object({
  provider: z.string().min(1).max(100),
});

export const CreateRoamingDetailSchema = z.object({
  geoZoneId: UuidSchema,
  dataMb: z.number().int().positive(),
  durationDays: z.number().int().positive(),
  hasThrottle: z.boolean().default(false),
});

export const CreateDeviceDetailSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  storageGb: z.number().int().optional(),
  financingMonths: z.number().int().positive().optional(),
  financingMonthly: z.number().min(0).optional(),
});

export const CreateItemBenefitSchema = z.object({
  benefitTypeId: UuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  durationDays: z.number().int().positive().optional(),
});

export const CreateAgeConditionSchema = z.object({
  minAge: z.number().int().min(0),
  maxAge: z.number().int().min(0).optional(),
});

export const CreateLegalConditionSchema = z.object({
  legalRequirement: z.string().min(1),
  description: z.string().max(255).optional(),
});

export const CreateTemporalConditionSchema = z.object({
  effectiveDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
});

export const CreateCatalogItemRequestSchema = z.object({
  categoryId: UuidSchema,
  itemTypeId: UuidSchema,
  contractTypeId: UuidSchema,
  segmentId: UuidSchema,
  tierId: UuidSchema,
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().min(0),
  activationCode: z.string().max(50).optional(),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  permanenceMonths: z.number().int().min(0).default(0),
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
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  activationCode: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  permanenceMonths: z.number().int().min(0).optional(),
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

export const ListCatalogItemsQuerySchema = PaginationQuerySchema.extend({
  categoryId: UuidSchema.optional(),
  itemTypeId: UuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
export type ListCatalogItemsQuery = z.infer<typeof ListCatalogItemsQuerySchema>;

export const CreateContentBlockRequestSchema = z.object({
  contentKey: z.string().min(1).max(100),
  contentTypeId: UuidSchema,
  title: z.string().max(200).optional(),
  body: z.string().optional(),
  sortOrder: z.number().int().default(0),
});
export type CreateContentBlockRequest = z.infer<typeof CreateContentBlockRequestSchema>;

export const UpdateContentBlockRequestSchema = z.object({
  contentKey: z.string().min(1).max(100).optional(),
  contentTypeId: UuidSchema.optional(),
  title: z.string().max(200).optional(),
  body: z.string().optional(),
  sortOrder: z.number().int().optional(),
});
export type UpdateContentBlockRequest = z.infer<typeof UpdateContentBlockRequestSchema>;

export const ListContentBlocksQuerySchema = PaginationQuerySchema.extend({
  contentTypeId: UuidSchema.optional(),
  search: z.string().optional(),
});
export type ListContentBlocksQuery = z.infer<typeof ListContentBlocksQuerySchema>;

export const CreateContactRequestSchema = z.object({
  itemId: UuidSchema.optional(),
  clientName: z.string().min(1).max(200),
  clientEmail: EmailSchema,
  clientPhone: z.string().max(20).optional(),
  message: z.string().optional(),
});
export type CreateContactRequest = z.infer<typeof CreateContactRequestSchema>;

export const UpdateContactRequestSchema = z.object({
  isAttended: z.boolean().optional(),
});
export type UpdateContactRequest = z.infer<typeof UpdateContactRequestSchema>;

export const ListContactRequestsQuerySchema = PaginationQuerySchema.extend({
  itemId: UuidSchema.optional(),
  isAttended: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
export type ListContactRequestsQuery = z.infer<typeof ListContactRequestsQuerySchema>;
