import { describe, expect, it } from 'vitest';
import * as Catalog from '../../src/catalog/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const timestamps = {
  createdAt: '2026-08-15T12:00:00.000Z',
  updatedAt: '2026-08-15T13:00:00.000Z',
};
const category = { id: uuid, name: 'Mobile plans', slug: 'mobile-plans' };
const itemType = { id: uuid, code: 'PLAN', name: 'Plan' };
const detail = {
  id: uuid,
  gigasStructural: 10,
  gigasLoyalty: 5,
  minutesNational: null,
  minutesLdi: 100,
  sms: 50,
  hasUnlimitedMinutes: false,
  hasUnlimitedWhatsapp: true,
  hasSocialNetworks: false,
  includedRoamingGb: 1.5,
};
const benefit = {
  id: secondUuid,
  benefitTypeId: uuid,
  name: 'Music',
  description: null,
  durationDays: null,
  ...timestamps,
};
const fullCatalogItem = {
  id: uuid,
  name: 'Premium plan',
  description: 'Plan description',
  price: 39.99,
  activationCode: 'ACT-001',
  imagePath: null,
  isActive: true,
  isPublished: true,
  permanenceMonths: 12,
  category: { id: uuid, name: 'Mobile plans', slug: 'mobile-plans' },
  itemType,
  contractType: { id: secondUuid, code: 'POSTPAID', name: 'Postpaid' },
  segment: { id: uuid, code: 'PERSONAL', name: 'Personal' },
  tier: { id: secondUuid, code: 'PREMIUM', name: 'Premium' },
  voiceDetails: detail,
  connectivityDetails: { id: uuid, bandwidthMbps: 100 },
  digitalDetails: { id: uuid, provider: 'Streaming' },
  roamingDetails: { id: uuid, geoZoneId: secondUuid, dataMb: 500, durationDays: 30, hasThrottle: false },
  deviceDetails: {
    id: uuid,
    brand: 'Brand',
    model: 'Model',
    storageGb: null,
    financingMonths: 12,
    financingMonthly: 20,
  },
  benefits: [benefit],
  ageConditions: { id: uuid, minAge: 18, maxAge: null },
  legalConditions: { id: uuid, legalRequirement: 'ID required', description: null },
  temporalConditions: { id: uuid, effectiveDate: '2026-08-15', expirationDate: null },
  ...timestamps,
};

describe('catalog responses', () => {
  it('validates shared lookup and category tree responses', () => {
    const lookupSchemas = [
      Catalog.ItemTypeResponseSchema,
      Catalog.ContractTypeResponseSchema,
      Catalog.SegmentResponseSchema,
      Catalog.TierResponseSchema,
      Catalog.GeoZoneResponseSchema,
      Catalog.BenefitTypeResponseSchema,
      Catalog.ContentTypeResponseSchema,
    ];

    for (const schema of lookupSchemas) {
      expect(
        schema.safeParse({ id: uuid, code: 'CODE', name: 'Name', description: null, isActive: true, ...timestamps }).success
      ).toBe(true);
    }
    expect(
      Catalog.CategoryTreeResponseSchema.safeParse({
        id: uuid,
        parentId: null,
        name: 'Root',
        slug: 'root',
        description: null,
        sortOrder: 0,
        isActive: true,
        children: [
          {
            id: secondUuid,
            parentId: uuid,
            name: 'Child',
            slug: 'child',
            description: null,
            sortOrder: 1,
            isActive: true,
            children: [],
            ...timestamps,
          },
        ],
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Catalog.CategoryTreeResponseSchema.safeParse({
        id: uuid,
        parentId: null,
        name: 'Root',
        slug: 'root',
        description: null,
        sortOrder: 0,
        isActive: true,
        children: [{ id: secondUuid }],
        ...timestamps,
      }).success
    ).toBe(false);
  });

  it('validates catalog details, conditions and complete items', () => {
    expect(Catalog.VoiceDetailResponseSchema.safeParse(detail).success).toBe(true);
    expect(Catalog.ConnectivityDetailResponseSchema.safeParse({ id: uuid, bandwidthMbps: 100 }).success).toBe(true);
    expect(Catalog.DigitalDetailResponseSchema.safeParse({ id: uuid, provider: 'Streaming' }).success).toBe(true);
    expect(
      Catalog.RoamingDetailResponseSchema.safeParse({
        id: uuid,
        geoZoneId: secondUuid,
        dataMb: 500,
        durationDays: 30,
        hasThrottle: false,
      }).success
    ).toBe(true);
    expect(Catalog.DeviceDetailResponseSchema.safeParse(fullCatalogItem.deviceDetails).success).toBe(true);
    expect(Catalog.CatalogItemResponseSchema.safeParse(fullCatalogItem).success).toBe(true);
    expect(Catalog.CatalogItemResponseSchema.safeParse({ ...fullCatalogItem, price: '39.99' }).success).toBe(false);
  });

  it('keeps public catalog responses free of administrative fields', () => {
    const publicItem = {
      id: uuid,
      name: 'Premium plan',
      description: 'Plan description',
      price: 39.99,
      permanenceMonths: 12,
      imagePath: null,
      category,
      itemType,
      contractType: { id: secondUuid, code: 'POSTPAID', name: 'Postpaid' },
      segment: { id: uuid, code: 'PERSONAL', name: 'Personal' },
      tier: { id: secondUuid, code: 'PREMIUM', name: 'Premium' },
      voiceDetails: null,
      connectivityDetails: null,
      digitalDetails: null,
      roamingDetails: null,
      deviceDetails: null,
      benefits: [{ id: secondUuid, benefitTypeId: uuid, name: 'Music', description: null, durationDays: null }],
    };
    const result = Catalog.PublicCatalogItemResponseSchema.safeParse({
      ...publicItem,
      activationCode: 'ACT-001',
      isActive: true,
      isPublished: true,
      ageConditions: { id: uuid, minAge: 18, maxAge: null },
      legalConditions: null,
      temporalConditions: null,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('activationCode' in result.data).toBe(false);
      expect('isActive' in result.data).toBe(false);
      expect('isPublished' in result.data).toBe(false);
      expect('ageConditions' in result.data).toBe(false);
      expect('createdAt' in result.data).toBe(false);
    }
  });

  it('validates CMS, contact and list-item projections', () => {
    expect(
      Catalog.ContentBlockResponseSchema.safeParse({
        id: uuid,
        contentKey: 'home.hero',
        contentTypeId: uuid,
        contentType: { id: uuid, code: 'HTML', name: 'HTML' },
        title: 'Welcome',
        body: '<p>Welcome</p>',
        sortOrder: 0,
        ...timestamps,
      }).success
    ).toBe(true);
    expect(
      Catalog.CmsLandingResponseSchema.safeParse({
        blocks: {
          hero: {
            id: uuid,
            contentKey: 'home.hero',
            contentTypeId: uuid,
            contentType: null,
            title: 'Welcome',
            body: null,
            sortOrder: 0,
            ...timestamps,
          },
        },
      }).success
    ).toBe(true);
    expect(
      Catalog.ContactRequestResponseSchema.safeParse({
        id: uuid,
        itemId: null,
        clientName: 'Ana Perez',
        clientEmail: 'ana@example.com',
        clientPhone: null,
        message: null,
        isAttended: false,
        attendedAt: null,
        attendedBy: null,
        createdAt: timestamps.createdAt,
      }).success
    ).toBe(true);
    const listResult = Catalog.CatalogItemListItemResponseSchema.safeParse({
      id: uuid,
      name: 'Premium plan',
      price: 39.99,
      imagePath: null,
      isActive: true,
      isPublished: true,
      category,
      itemType: { id: uuid, name: 'Plan' },
      contractType: { id: secondUuid, name: 'Postpaid' },
      ...timestamps,
      description: 'stripped from list item',
    });

    expect(listResult.success).toBe(true);
    if (listResult.success) expect('description' in listResult.data).toBe(false);
  });
});
