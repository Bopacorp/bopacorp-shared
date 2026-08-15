import { describe, expect, it } from 'vitest';
import {
  BooleanQuerySchema,
  CorporateEmailSchema,
  EcuadorianIdSchema,
  EmailSchema,
  IpAddressSchema,
  NationalIdSchema,
  PaginationMetaSchema,
  PaginationQuerySchema,
  PhoneSchema,
  RucSchema,
  TimestampsSchema,
  UserAgentSchema,
  UuidSchema,
} from '../../src/common/index.js';
import { V } from '../../src/i18n/keys.js';

describe('common primitives', () => {
  describe('UuidSchema', () => {
    it('accepts a valid UUID', () => {
      expect(UuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true);
    });

    it('rejects an empty or malformed UUID with the contract message key', () => {
      const emptyResult = UuidSchema.safeParse('');
      const malformedResult = UuidSchema.safeParse('not-a-uuid');

      expect(emptyResult.success).toBe(false);
      expect(malformedResult.success).toBe(false);
      if (!emptyResult.success && !malformedResult.success) {
        expect(emptyResult.error.issues[0]?.message).toBe(V.REQUIRED);
        expect(malformedResult.error.issues[0]?.message).toBe(V.UUID_INVALID);
      }
    });
  });

  describe('email schemas', () => {
    it('accepts a valid email and rejects an invalid email', () => {
      expect(EmailSchema.safeParse('person@example.com').success).toBe(true);
      expect(EmailSchema.safeParse('not-an-email').success).toBe(false);
    });

    it('rejects an email over the declared maximum length', () => {
      const longEmail = `${'a'.repeat(140)}@example.com`;

      expect(longEmail.length).toBeGreaterThan(150);
      expect(EmailSchema.safeParse(longEmail).success).toBe(false);
    });

    it('accepts only the configured corporate domain', () => {
      expect(CorporateEmailSchema.safeParse('person@bopacorp.com').success).toBe(true);
      expect(CorporateEmailSchema.safeParse('person@example.com').success).toBe(false);
      expect(CorporateEmailSchema.safeParse('person@BOPACORP.COM').success).toBe(false);
    });
  });

  describe('bounded metadata schemas', () => {
    it('enforces the IP address and user agent length limits', () => {
      expect(IpAddressSchema.safeParse('1'.repeat(45)).success).toBe(true);
      expect(IpAddressSchema.safeParse('1'.repeat(46)).success).toBe(false);
      expect(UserAgentSchema.safeParse('a'.repeat(500)).success).toBe(true);
      expect(UserAgentSchema.safeParse('a'.repeat(501)).success).toBe(false);
    });
  });

  describe('BooleanQuerySchema', () => {
    it('coerces supported query strings to booleans', () => {
      expect(BooleanQuerySchema.parse('true')).toBe(true);
      expect(BooleanQuerySchema.parse('false')).toBe(false);
    });

    it('rejects unsupported casing and non-string input', () => {
      expect(BooleanQuerySchema.safeParse('TRUE').success).toBe(false);
      expect(BooleanQuerySchema.safeParse(true).success).toBe(false);
      expect(BooleanQuerySchema.safeParse('yes').success).toBe(false);
    });
  });

  describe('PaginationQuerySchema', () => {
    it('applies defaults when query parameters are omitted', () => {
      expect(PaginationQuerySchema.parse({})).toEqual({
        page: 1,
        limit: 20,
        sortOrder: 'asc',
      });
    });

    it('coerces numeric strings and preserves optional sorting', () => {
      expect(
        PaginationQuerySchema.parse({
          page: '2',
          limit: '10',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })
      ).toEqual({
        page: 2,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('rejects values outside the page, limit and sort order constraints', () => {
      expect(PaginationQuerySchema.safeParse({ page: 0 }).success).toBe(false);
      expect(PaginationQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
      expect(PaginationQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
      expect(PaginationQuerySchema.safeParse({ page: 1.5 }).success).toBe(false);
      expect(PaginationQuerySchema.safeParse({ sortOrder: 'sideways' }).success).toBe(false);
    });
  });

  describe('PaginationMetaSchema and TimestampsSchema', () => {
    it('accepts integer pagination metadata', () => {
      expect(
        PaginationMetaSchema.safeParse({
          page: 2,
          limit: 20,
          totalItems: 143,
          totalPages: 8,
        }).success
      ).toBe(true);
      expect(PaginationMetaSchema.safeParse({ page: 1.5, limit: 20, totalItems: 1, totalPages: 1 }).success).toBe(
        false
      );
    });

    it('accepts ISO timestamps and rejects invalid timestamps', () => {
      expect(
        TimestampsSchema.safeParse({
          createdAt: '2026-08-15T12:00:00.000Z',
          updatedAt: '2026-08-15T13:00:00.000Z',
        }).success
      ).toBe(true);
      expect(
        TimestampsSchema.safeParse({ createdAt: 'not-a-date', updatedAt: '2026-08-15T13:00:00.000Z' }).success
      ).toBe(false);
    });
  });

  describe('Ecuadorian identifiers and phone numbers', () => {
    it('accepts identifiers and phones at their declared boundaries', () => {
      expect(EcuadorianIdSchema.safeParse('1234567890').success).toBe(true);
      expect(RucSchema.safeParse('1234567890123').success).toBe(true);
      expect(NationalIdSchema.safeParse('1234567890').success).toBe(true);
      expect(NationalIdSchema.safeParse('1234567890123').success).toBe(true);
      expect(PhoneSchema.safeParse('099123456').success).toBe(true);
      expect(PhoneSchema.safeParse('0991234567').success).toBe(true);
    });

    it('rejects invalid lengths and non-digit values', () => {
      expect(EcuadorianIdSchema.safeParse('123456789').success).toBe(false);
      expect(EcuadorianIdSchema.safeParse('12345678901').success).toBe(false);
      expect(EcuadorianIdSchema.safeParse('123456789A').success).toBe(false);
      expect(RucSchema.safeParse('123456789012').success).toBe(false);
      expect(RucSchema.safeParse('123456789012A').success).toBe(false);
      expect(NationalIdSchema.safeParse('123456789').success).toBe(false);
      expect(NationalIdSchema.safeParse('12345678901234').success).toBe(false);
      expect(NationalIdSchema.safeParse('123456789A').success).toBe(false);
      expect(PhoneSchema.safeParse('09912345').success).toBe(false);
      expect(PhoneSchema.safeParse('09912345678').success).toBe(false);
      expect(PhoneSchema.safeParse('09912345A').success).toBe(false);
    });
  });
});
