import { describe, expect, it } from 'vitest';
import { en, es, resolveValidationMessage } from '../src/i18n/index.js';
import { V, vk } from '../src/i18n/keys.js';

describe('i18n contracts', () => {
  it('resolves known validation keys in Spanish and English', () => {
    expect(resolveValidationMessage(vk(V.MAX_CHARS, { max: 50 }), es)).toBe('Máximo 50 caracteres');
    expect(resolveValidationMessage(vk(V.MAX_CHARS, { max: 50 }), en)).toBe('Maximum 50 characters');
  });

  it('supports multiple parameters and preserves missing parameters', () => {
    expect(resolveValidationMessage(vk(V.MIN_ITEMS, { min: 3 }), es)).toBe('Debe seleccionar al menos 3');
    expect(resolveValidationMessage(V.MAX_CHARS, es)).toBe('Máximo {{max}} caracteres');
    expect(resolveValidationMessage(`${V.MAX_CHARS}|max:10|unused:value`, es)).toBe('Máximo 10 caracteres');
  });

  it('returns unknown keys unchanged and keeps locale key sets aligned', () => {
    expect(resolveValidationMessage('validation.unknown|value:test', es)).toBe('validation.unknown|value:test');
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it('builds parameterized validation keys without changing the base key', () => {
    expect(vk(V.FILE_MIN_SIZE, { min: 0.01 })).toBe('validation.file.min_size|min:0.01');
    expect(vk(V.REQUIRED)).toBe(V.REQUIRED);
  });
});
