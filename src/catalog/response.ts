import { z } from 'zod';
import { TimestampsSchema, UuidSchema } from '../common/primitives.js';

// ============================================================================
// Lookup table responses (7 tables)
// ============================================================================

const lookupResponse = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);

const lookupListItemResponse = z
  .object({
    id: UuidSchema,
    code: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);

export const ItemTypeResponseSchema = lookupResponse;
export type ItemTypeResponse = z.infer<typeof ItemTypeResponseSchema>;

export const ItemTypeListItemResponseSchema = lookupListItemResponse;
export type ItemTypeListItemResponse = z.infer<typeof ItemTypeListItemResponseSchema>;

export const ContractTypeResponseSchema = lookupResponse;
export type ContractTypeResponse = z.infer<typeof ContractTypeResponseSchema>;

export const ContractTypeListItemResponseSchema = lookupListItemResponse;
export type ContractTypeListItemResponse = z.infer<typeof ContractTypeListItemResponseSchema>;

export const SegmentResponseSchema = lookupResponse;
export type SegmentResponse = z.infer<typeof SegmentResponseSchema>;

export const SegmentListItemResponseSchema = lookupListItemResponse;
export type SegmentListItemResponse = z.infer<typeof SegmentListItemResponseSchema>;

export const TierResponseSchema = lookupResponse;
export type TierResponse = z.infer<typeof TierResponseSchema>;

export const TierListItemResponseSchema = lookupListItemResponse;
export type TierListItemResponse = z.infer<typeof TierListItemResponseSchema>;

export const GeoZoneResponseSchema = lookupResponse;
export type GeoZoneResponse = z.infer<typeof GeoZoneResponseSchema>;

export const GeoZoneListItemResponseSchema = lookupListItemResponse;
export type GeoZoneListItemResponse = z.infer<typeof GeoZoneListItemResponseSchema>;

export const BenefitTypeResponseSchema = lookupResponse;
export type BenefitTypeResponse = z.infer<typeof BenefitTypeResponseSchema>;

export const BenefitTypeListItemResponseSchema = lookupListItemResponse;
export type BenefitTypeListItemResponse = z.infer<typeof BenefitTypeListItemResponseSchema>;

export const ContentTypeResponseSchema = lookupResponse;
export type ContentTypeResponse = z.infer<typeof ContentTypeResponseSchema>;

export const ContentTypeListItemResponseSchema = lookupListItemResponse;
export type ContentTypeListItemResponse = z.infer<typeof ContentTypeListItemResponseSchema>;

// ============================================================================
// Categories (hierarchical)
// ============================================================================

export const CategoryResponseSchema = z
  .object({
    id: UuidSchema,
    parentId: UuidSchema.nullable(),
    name: z.string(),
    description: z.string().nullable(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;

export const CategoryListItemResponseSchema = z
  .object({
    id: UuidSchema,
    parentId: UuidSchema.nullable(),
    name: z.string(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
  })
  .merge(TimestampsSchema);
export type CategoryListItemResponse = z.infer<typeof CategoryListItemResponseSchema>;

interface CategoryTree extends z.infer<typeof CategoryResponseSchema> {
  children: CategoryTree[];
}

export const CategoryTreeResponseSchema: z.ZodType<CategoryTree> = CategoryResponseSchema.extend({
  children: z.lazy(() => z.array(CategoryTreeResponseSchema)),
});
export type CategoryTreeResponse = z.infer<typeof CategoryTreeResponseSchema>;

// ============================================================================
// Detail table responses (1:1 with catalog_items)
// ============================================================================

export const VoiceDetailResponseSchema = z.object({
  id: UuidSchema,
  gigasStructural: z.number().int(),
  gigasLoyalty: z.number().int(),
  minutesNational: z.number().int().nullable(),
  minutesLdi: z.number().int(),
  sms: z.number().int(),
  hasUnlimitedMinutes: z.boolean(),
  hasUnlimitedWhatsapp: z.boolean(),
  hasSocialNetworks: z.boolean(),
  includedRoamingGb: z.number(),
});
export type VoiceDetailResponse = z.infer<typeof VoiceDetailResponseSchema>;

export const ConnectivityDetailResponseSchema = z.object({
  id: UuidSchema,
  bandwidthMbps: z.number(),
});
export type ConnectivityDetailResponse = z.infer<typeof ConnectivityDetailResponseSchema>;

export const DigitalDetailResponseSchema = z.object({
  id: UuidSchema,
  provider: z.string(),
});
export type DigitalDetailResponse = z.infer<typeof DigitalDetailResponseSchema>;

export const RoamingDetailResponseSchema = z.object({
  id: UuidSchema,
  geoZoneId: UuidSchema,
  dataMb: z.number().int(),
  durationDays: z.number().int(),
  hasThrottle: z.boolean(),
});
export type RoamingDetailResponse = z.infer<typeof RoamingDetailResponseSchema>;

export const DeviceDetailResponseSchema = z.object({
  id: UuidSchema,
  brand: z.string(),
  model: z.string(),
  storageGb: z.number().int().nullable(),
  financingMonths: z.number().int().nullable(),
  financingMonthly: z.number().nullable(),
});
export type DeviceDetailResponse = z.infer<typeof DeviceDetailResponseSchema>;

// ============================================================================
// Item benefit response
// ============================================================================

export const ItemBenefitResponseSchema = z
  .object({
    id: UuidSchema,
    benefitTypeId: UuidSchema,
    name: z.string(),
    description: z.string().nullable(),
    durationDays: z.number().int().nullable(),
  })
  .merge(TimestampsSchema);
export type ItemBenefitResponse = z.infer<typeof ItemBenefitResponseSchema>;

// ============================================================================
// Condition table responses
// ============================================================================

export const AgeConditionResponseSchema = z.object({
  id: UuidSchema,
  minAge: z.number().int(),
  maxAge: z.number().int().nullable(),
});
export type AgeConditionResponse = z.infer<typeof AgeConditionResponseSchema>;

export const LegalConditionResponseSchema = z.object({
  id: UuidSchema,
  legalRequirement: z.string(),
  description: z.string().nullable(),
});
export type LegalConditionResponse = z.infer<typeof LegalConditionResponseSchema>;

export const TemporalConditionResponseSchema = z.object({
  id: UuidSchema,
  effectiveDate: z.string(),
  expirationDate: z.string().nullable(),
});
export type TemporalConditionResponse = z.infer<typeof TemporalConditionResponseSchema>;

// ============================================================================
// Catalog items (core product)
// ============================================================================

const CatalogItemCategoryRefSchema = z.object({
  id: UuidSchema,
  name: z.string(),
});

const CatalogItemTypeRefSchema = z.object({
  id: UuidSchema,
  code: z.string(),
  name: z.string(),
});

export const CatalogItemResponseSchema = z
  .object({
    id: UuidSchema,
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    activationCode: z.string().nullable(),
    isActive: z.boolean(),
    isPublished: z.boolean(),
    permanenceMonths: z.number().int(),
    category: CatalogItemCategoryRefSchema,
    itemType: CatalogItemTypeRefSchema,
    contractType: CatalogItemTypeRefSchema,
    segment: CatalogItemTypeRefSchema,
    tier: CatalogItemTypeRefSchema,
    voiceDetails: VoiceDetailResponseSchema.nullable(),
    connectivityDetails: ConnectivityDetailResponseSchema.nullable(),
    digitalDetails: DigitalDetailResponseSchema.nullable(),
    roamingDetails: RoamingDetailResponseSchema.nullable(),
    deviceDetails: DeviceDetailResponseSchema.nullable(),
    benefits: z.array(ItemBenefitResponseSchema),
    ageConditions: AgeConditionResponseSchema.nullable(),
    legalConditions: LegalConditionResponseSchema.nullable(),
    temporalConditions: TemporalConditionResponseSchema.nullable(),
  })
  .merge(TimestampsSchema);
export type CatalogItemResponse = z.infer<typeof CatalogItemResponseSchema>;

export const CatalogItemListItemResponseSchema = z
  .object({
    id: UuidSchema,
    name: z.string(),
    price: z.number(),
    isActive: z.boolean(),
    isPublished: z.boolean(),
    category: CatalogItemCategoryRefSchema,
    itemType: z.object({
      id: UuidSchema,
      name: z.string(),
    }),
    contractType: z.object({
      id: UuidSchema,
      name: z.string(),
    }),
  })
  .merge(TimestampsSchema);
export type CatalogItemListItemResponse = z.infer<typeof CatalogItemListItemResponseSchema>;

// ============================================================================
// Content blocks (CMS)
// ============================================================================

export const ContentBlockResponseSchema = z
  .object({
    id: UuidSchema,
    contentKey: z.string(),
    contentTypeId: UuidSchema,
    title: z.string().nullable(),
    body: z.string().nullable(),
    sortOrder: z.number().int(),
  })
  .merge(TimestampsSchema);
export type ContentBlockResponse = z.infer<typeof ContentBlockResponseSchema>;

export const CmsLandingResponseSchema = z.object({
  blocks: z.record(z.string(), ContentBlockResponseSchema),
});
export type CmsLandingResponse = z.infer<typeof CmsLandingResponseSchema>;

// ============================================================================
// Contact requests
// ============================================================================

export const ContactRequestResponseSchema = z.object({
  id: UuidSchema,
  itemId: UuidSchema.nullable(),
  clientName: z.string(),
  clientEmail: z.string(),
  clientPhone: z.string().nullable(),
  message: z.string().nullable(),
  isAttended: z.boolean(),
  attendedAt: z.string().datetime().nullable(),
  attendedBy: UuidSchema.nullable(),
  createdAt: z.string().datetime(),
});
export type ContactRequestResponse = z.infer<typeof ContactRequestResponseSchema>;
