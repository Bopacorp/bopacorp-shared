export const V = {
  REQUIRED: 'validation.required',
  MAX_CHARS: 'validation.max_chars',
  MIN_CHARS: 'validation.min_chars',
  INTEGER: 'validation.integer',
  POSITIVE: 'validation.positive',
  NON_NEGATIVE: 'validation.non_negative',
  MIN_ITEMS: 'validation.min_items',

  EMAIL_INVALID: 'validation.email.invalid',
  EMAIL_MAX: 'validation.email.max',
  EMAIL_CORPORATE_ONLY: 'validation.email.corporate_only',

  URL_INVALID: 'validation.url.invalid',
  URL_MAX: 'validation.url.max',

  PASSWORD_REQUIRED: 'validation.password.required',
  PASSWORD_MIN: 'validation.password.min_length',
  PASSWORD_MAX: 'validation.password.max_length',
  PASSWORD_UPPERCASE: 'validation.password.uppercase',
  PASSWORD_LOWERCASE: 'validation.password.lowercase',
  PASSWORD_DIGIT: 'validation.password.digit',
  PASSWORD_SPECIAL: 'validation.password.special',

  CEDULA_LENGTH: 'validation.cedula.length',
  CEDULA_DIGITS: 'validation.cedula.digits_only',
  RUC_LENGTH: 'validation.ruc.length',
  RUC_DIGITS: 'validation.ruc.digits_only',
  NATIONAL_ID_MIN: 'validation.national_id.min_length',
  NATIONAL_ID_MAX: 'validation.national_id.max_length',
  NATIONAL_ID_DIGITS: 'validation.national_id.digits_only',

  PHONE_MIN: 'validation.phone.min_length',
  PHONE_MAX: 'validation.phone.max_length',
  PHONE_DIGITS: 'validation.phone.digits_only',

  DATE_INVALID: 'validation.date.invalid',
  DATETIME_INVALID: 'validation.datetime.invalid',

  BOOLEAN_INVALID: 'validation.boolean.invalid',

  SLUG_PATTERN: 'validation.slug.pattern',

  PAGINATION_PAGE_INT: 'validation.pagination.page_integer',
  PAGINATION_PAGE_MIN: 'validation.pagination.page_min',
  PAGINATION_LIMIT_INT: 'validation.pagination.limit_integer',
  PAGINATION_LIMIT_MIN: 'validation.pagination.limit_min',
  PAGINATION_LIMIT_MAX: 'validation.pagination.limit_max',

  FILE_MIN_SIZE: 'validation.file.min_size',
  FILE_MAX_SIZE: 'validation.file.max_size',
  FILE_PDF_ONLY: 'validation.file.pdf_only',
  REJECTION_REASON_REQUIRED: 'validation.rejection.reason_required',

  ADDRESS_MAX: 'validation.address.max',

  PERMANENCE_NON_NEGATIVE: 'validation.permanence.non_negative',
} as const;

export type ValidationKey = (typeof V)[keyof typeof V];

export function vk(key: string, params?: Record<string, string | number>): string {
  if (!params) return key;
  const parts = Object.entries(params).map(([k, v]) => `${k}:${v}`);
  return `${key}|${parts.join('|')}`;
}
