export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const STORAGE_KEY = "cynosural-locale";

/**
 * Resolve a BCP-47 tag (e.g. "es-ES", "en-US") to one of our supported
 * locales, falling back to the default locale when there is no match.
 */
export function resolveLocale(tag: string | undefined): Locale {
  if (!tag) return DEFAULT_LOCALE;
  const short = tag.toLowerCase().slice(0, 2);
  return (LOCALES as readonly string[]).includes(short) ? (short as Locale) : DEFAULT_LOCALE;
}
