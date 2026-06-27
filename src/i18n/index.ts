export { es } from './es.js';
export type { LocaleMessages } from './es.js';
export { en } from './en.js';
export { V, vk } from './keys.js';
export type { ValidationKey } from './keys.js';

import type { LocaleMessages } from './es.js';

export function resolveValidationMessage(
  raw: string,
  locale: LocaleMessages,
): string {
  const [key, ...paramParts] = raw.split('|');
  const template = locale[key as keyof LocaleMessages];
  if (!template) return raw;
  const params: Record<string, string> = {};
  for (const part of paramParts) {
    const idx = part.indexOf(':');
    if (idx > 0) params[part.slice(0, idx)] = part.slice(idx + 1);
  }
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => params[k] ?? _);
}
