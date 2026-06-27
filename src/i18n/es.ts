import { V } from './keys.js';

export const es = {
  [V.REQUIRED]: 'Este campo es obligatorio',
  [V.MAX_CHARS]: 'Máximo {{max}} caracteres',
  [V.MIN_CHARS]: 'Mínimo {{min}} caracteres',
  [V.INTEGER]: 'Debe ser un número entero',
  [V.POSITIVE]: 'Debe ser un número entero positivo',
  [V.NON_NEGATIVE]: 'No puede ser negativo',
  [V.MIN_ITEMS]: 'Debe seleccionar al menos {{min}}',

  [V.EMAIL_INVALID]: 'Correo electrónico no válido',
  [V.EMAIL_MAX]: 'El correo no puede exceder {{max}} caracteres',
  [V.EMAIL_CORPORATE_ONLY]: 'Solo se permiten correos @bopacorp.com',

  [V.URL_INVALID]: 'La URL no es válida',
  [V.URL_MAX]: 'La URL no puede exceder {{max}} caracteres',

  [V.PASSWORD_REQUIRED]: 'La contraseña es obligatoria',
  [V.PASSWORD_MIN]: 'La contraseña debe tener al menos {{min}} caracteres',
  [V.PASSWORD_MAX]: 'La contraseña no puede exceder {{max}} caracteres',
  [V.PASSWORD_UPPERCASE]: 'La contraseña debe tener al menos una mayúscula',
  [V.PASSWORD_LOWERCASE]: 'La contraseña debe tener al menos una minúscula',
  [V.PASSWORD_DIGIT]: 'La contraseña debe tener al menos un número',
  [V.PASSWORD_SPECIAL]: 'La contraseña debe tener al menos un carácter especial',

  [V.CEDULA_LENGTH]: 'La cédula debe tener {{length}} dígitos',
  [V.CEDULA_DIGITS]: 'La cédula solo debe contener números',
  [V.RUC_LENGTH]: 'El RUC debe tener {{length}} dígitos',
  [V.RUC_DIGITS]: 'El RUC solo debe contener números',
  [V.NATIONAL_ID_MIN]: 'El documento debe tener al menos {{min}} dígitos',
  [V.NATIONAL_ID_MAX]: 'El documento debe tener máximo {{max}} dígitos',
  [V.NATIONAL_ID_DIGITS]: 'El documento solo debe contener números',

  [V.PHONE_MIN]: 'El teléfono debe tener al menos {{min}} dígitos',
  [V.PHONE_MAX]: 'El teléfono debe tener máximo {{max}} dígitos',
  [V.PHONE_DIGITS]: 'El teléfono solo debe contener números',

  [V.DATE_INVALID]: 'La fecha no es válida',
  [V.DATETIME_INVALID]: 'La fecha y hora no es válida',

  [V.BOOLEAN_INVALID]: 'El valor debe ser true o false',

  [V.UUID_INVALID]: 'Identificador no válido',

  [V.SLUG_PATTERN]: 'Solo letras minúsculas, números y guiones',

  [V.PAGINATION_PAGE_INT]: 'La página debe ser un número entero',
  [V.PAGINATION_PAGE_MIN]: 'La página mínima es {{min}}',
  [V.PAGINATION_LIMIT_INT]: 'El límite debe ser un número entero',
  [V.PAGINATION_LIMIT_MIN]: 'El límite mínimo es {{min}}',
  [V.PAGINATION_LIMIT_MAX]: 'El límite máximo es {{max}}',

  [V.FILE_MIN_SIZE]: 'El archivo debe pesar al menos {{min}} MB',
  [V.FILE_MAX_SIZE]: 'El archivo debe pesar menos de {{max}} MB',
  [V.FILE_PDF_ONLY]: 'Solo se permiten archivos PDF',
  [V.REJECTION_REASON_REQUIRED]: 'El motivo de rechazo es obligatorio',

  [V.ADDRESS_MAX]: 'La dirección no puede exceder {{max}} caracteres',

  [V.PERMANENCE_NON_NEGATIVE]: 'Los meses de permanencia no pueden ser negativos',
} as const;

export type LocaleMessages = Record<keyof typeof es, string>;
