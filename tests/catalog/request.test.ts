import { describe, expect, it } from 'vitest';
import * as Catalog from '../../src/catalog/index.js';

const uuid = '550e8400-e29b-41d4-a716-446655440000';
const secondUuid = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';

describe('catalog requests', () => {
  it('applies shared defaults to every lookup create schema', () => {
    const schemas = [
      Catalog.CreateItemTypeRequestSchema,
      Catalog.CreateContractTypeRequestSchema,
      Catalog.CreateSegmentRequestSchema,
      Catalog.CreateTierRequestSchema,
      Catalog.CreateGeoZoneRequestSchema,
      Catalog.CreateBenefitTypeRequestSchema,
      Catalog.CreateContentTypeRequestSchema,
    ];

    for (const schema of schemas) {
      expect(schema.parse({ code: 'CODE', name: 'Name' })).toMatchObject({ isActive: true });
    }
  });

  it('validates lookup updates and query coercion', () => {
    expect(Catalog.UpdateItemTypeRequestSchema.parse({ name: 'Updated' })).toEqual({ name: 'Updated' });
    expect(Catalog.UpdateTierRequestSchema.safeParse({ code: '' }).success).toBe(false);
    expect(
      Catalog.ListContentTypesQuerySchema.parse({ search: 'html', isActive: 'true', page: '2', limit: '10' })
    ).toMatchObject({ search: 'html', isActive: true, page: 2, limit: 10 });
    expect(Catalog.ListGeoZonesQuerySchema.safeParse({ isActive: 'TRUE' }).success).toBe(false);
  });

  it('validates hierarchical categories and slug boundaries', () => {
    expect(
      Catalog.CreateCategoryRequestSchema.parse({ name: 'Mobile plans', slug: 'mobile-plans' })
    ).toMatchObject({ sortOrder: 0, isActive: true });
    expect(
      Catalog.UpdateCategoryRequestSchema.parse({ parentId: null, slug: 'new-slug' })
    ).toEqual({ parentId: null, slug: 'new-slug' });
    expect(Catalog.CreateCategoryRequestSchema.safeParse({ name: 'Invalid', slug: 'Not Valid' }).success).toBe(false);
    expect(Catalog.CreateCategoryRequestSchema.safeParse({ parentId: 'bad', name: 'Child', slug: 'child' }).success).toBe(
      false
    );
    expect(Catalog.ListCategoriesQuerySchema.parse({ parentId: uuid, isActive: 'false' })).toMatchObject({
      parentId: uuid,
      isActive: false,
    });
  });

  it('validates product detail, benefit and condition requests', () => {
    expect(Catalog.CreateVoiceDetailSchema.parse({ gigasStructural: 10 })).toMatchObject({
      gigasLoyalty: 0,
      minutesLdi: 0,
      sms: 0,
      hasUnlimitedWhatsapp: true,
    });
    expect(Catalog.CreateConnectivityDetailSchema.safeParse({ bandwidthMbps: 100 }).success).toBe(true);
    expect(Catalog.CreateDigitalDetailSchema.safeParse({ provider: 'Streaming' }).success).toBe(true);
    expect(
      Catalog.CreateRoamingDetailSchema.safeParse({ geoZoneId: uuid, dataMb: 500, durationDays: 30 }).success
    ).toBe(true);
    expect(Catalog.CreateDeviceDetailSchema.safeParse({ brand: 'Brand', model: 'Model' }).success).toBe(true);
    expect(Catalog.CreateRoamingDetailSchema.safeParse({ geoZoneId: uuid, dataMb: 0, durationDays: 30 }).success).toBe(
      false
    );
    expect(Catalog.CreateItemBenefitSchema.safeParse({ benefitTypeId: uuid, name: 'Music' }).success).toBe(true);
    expect(Catalog.CreateItemBenefitSchema.safeParse({ benefitTypeId: uuid, name: 'Music', durationDays: 0 }).success).toBe(
      false
    );
    expect(Catalog.CreateAgeConditionSchema.safeParse({ minAge: 18, maxAge: 65 }).success).toBe(true);
    expect(Catalog.CreateLegalConditionSchema.safeParse({ legalRequirement: 'ID required' }).success).toBe(true);
    expect(Catalog.CreateTemporalConditionSchema.safeParse({ effectiveDate: '2026-08-15' }).success).toBe(true);
  });

  it('validates complete catalog item requests and public filters', () => {
    const request = {
      categoryId: uuid,
      itemTypeId: uuid,
      contractTypeId: secondUuid,
      segmentId: uuid,
      tierId: secondUuid,
      name: 'Premium plan',
      description: 'Plan description',
      price: 39.99,
      permanenceMonths: 12,
      voiceDetails: { gigasStructural: 10 },
      benefits: [{ benefitTypeId: uuid, name: 'Music' }],
      ageConditions: { minAge: 18 },
      legalConditions: { legalRequirement: 'ID required' },
      temporalConditions: { effectiveDate: '2026-08-15' },
    };

    expect(Catalog.CreateCatalogItemRequestSchema.parse(request)).toMatchObject({
      ...request,
      isActive: true,
      isPublished: false,
      permanenceMonths: 12,
    });
    expect(Catalog.UpdateCatalogItemRequestSchema.parse({ price: 0, isPublished: true })).toEqual({
      price: 0,
      isPublished: true,
    });
    expect(Catalog.CreateCatalogItemRequestSchema.safeParse({ ...request, price: -1 }).success).toBe(false);
    expect(Catalog.CreateCatalogItemRequestSchema.safeParse({ ...request, permanenceMonths: -1 }).success).toBe(false);
    expect(
      Catalog.ListPublicCatalogQuerySchema.parse({ categoryId: uuid, minPrice: '0', maxPrice: '100' })
    ).toMatchObject({ categoryId: uuid, minPrice: 0, maxPrice: 100 });
    expect(Catalog.ListCatalogItemsQuerySchema.parse({ isPublished: 'true', categoryId: uuid })).toMatchObject({
      isPublished: true,
      categoryId: uuid,
    });
  });

  it('validates CMS blocks and public contact requests', () => {
    expect(
      Catalog.CreateContentBlockRequestSchema.parse({ contentKey: 'home.hero', contentTypeId: uuid })
    ).toMatchObject({ sortOrder: 0 });
    expect(Catalog.UpdateContentBlockRequestSchema.parse({ body: 'Updated body' })).toEqual({ body: 'Updated body' });
    expect(Catalog.ListContentBlocksQuerySchema.parse({ contentTypeId: uuid, section: 'home' })).toMatchObject({
      contentTypeId: uuid,
      section: 'home',
    });
    expect(
      Catalog.CreateContactRequestSchema.safeParse({
        itemId: uuid,
        clientName: 'Ana Perez',
        clientEmail: 'ana@example.com',
        clientPhone: '0991234567',
        message: 'I want more information',
      }).success
    ).toBe(true);
    expect(Catalog.CreateContactRequestSchema.safeParse({ clientName: 'Ana', clientEmail: 'bad' }).success).toBe(false);
    expect(Catalog.UpdateContactRequestSchema.safeParse({ isAttended: true }).success).toBe(true);
    expect(Catalog.ListContactRequestsQuerySchema.parse({ itemId: uuid, isAttended: 'false' })).toMatchObject({
      itemId: uuid,
      isAttended: false,
    });
  });
});
