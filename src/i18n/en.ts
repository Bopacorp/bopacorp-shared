import type { LocaleMessages } from './es.js';
import { V } from './keys.js';

export const en: LocaleMessages = {
  [V.REQUIRED]: 'This field is required',
  [V.MAX_CHARS]: 'Maximum {{max}} characters',
  [V.MIN_CHARS]: 'Minimum {{min}} characters',
  [V.INTEGER]: 'Must be an integer',
  [V.POSITIVE]: 'Must be a positive integer',
  [V.NON_NEGATIVE]: 'Cannot be negative',
  [V.MIN_ITEMS]: 'Must select at least {{min}}',

  [V.EMAIL_INVALID]: 'Invalid email address',
  [V.EMAIL_MAX]: 'Email cannot exceed {{max}} characters',
  [V.EMAIL_CORPORATE_ONLY]: 'Only @bopacorp.com emails are allowed',

  [V.URL_INVALID]: 'Invalid URL',
  [V.URL_MAX]: 'URL cannot exceed {{max}} characters',

  [V.PASSWORD_REQUIRED]: 'Password is required',
  [V.PASSWORD_MIN]: 'Password must be at least {{min}} characters',
  [V.PASSWORD_MAX]: 'Password cannot exceed {{max}} characters',
  [V.PASSWORD_UPPERCASE]: 'Password must contain at least one uppercase letter',
  [V.PASSWORD_LOWERCASE]: 'Password must contain at least one lowercase letter',
  [V.PASSWORD_DIGIT]: 'Password must contain at least one number',
  [V.PASSWORD_SPECIAL]: 'Password must contain at least one special character',

  [V.CEDULA_LENGTH]: 'ID number must be {{length}} digits',
  [V.CEDULA_DIGITS]: 'ID number must contain only digits',
  [V.RUC_LENGTH]: 'RUC must be {{length}} digits',
  [V.RUC_DIGITS]: 'RUC must contain only digits',
  [V.NATIONAL_ID_MIN]: 'Document must be at least {{min}} digits',
  [V.NATIONAL_ID_MAX]: 'Document must be at most {{max}} digits',
  [V.NATIONAL_ID_DIGITS]: 'Document must contain only digits',

  [V.PHONE_MIN]: 'Phone must be at least {{min}} digits',
  [V.PHONE_MAX]: 'Phone must be at most {{max}} digits',
  [V.PHONE_DIGITS]: 'Phone must contain only digits',

  [V.DATE_INVALID]: 'Invalid date',
  [V.DATETIME_INVALID]: 'Invalid date and time',

  [V.BOOLEAN_INVALID]: 'Value must be true or false',

  [V.SLUG_PATTERN]: 'Only lowercase letters, numbers, and hyphens',

  [V.PAGINATION_PAGE_INT]: 'Page must be an integer',
  [V.PAGINATION_PAGE_MIN]: 'Minimum page is {{min}}',
  [V.PAGINATION_LIMIT_INT]: 'Limit must be an integer',
  [V.PAGINATION_LIMIT_MIN]: 'Minimum limit is {{min}}',
  [V.PAGINATION_LIMIT_MAX]: 'Maximum limit is {{max}}',

  [V.FILE_MIN_SIZE]: 'File must be at least {{min}} MB',
  [V.FILE_MAX_SIZE]: 'File must be less than {{max}} MB',
  [V.FILE_PDF_ONLY]: 'Only PDF files are allowed',
  [V.REJECTION_REASON_REQUIRED]: 'Rejection reason is required',

  [V.ADDRESS_MAX]: 'Address cannot exceed {{max}} characters',

  [V.PERMANENCE_NON_NEGATIVE]: 'Permanence months cannot be negative',
} as const;
