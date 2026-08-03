"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, LOCALES, resolveLocale, STORAGE_KEY, type Locale } from "./config";
import { dictionaries, type Namespace } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * A tiny external store for the active locale.
 *
 * Reading the user's preferred locale requires `window` (localStorage /
 * navigator.language), which isn't available during SSR. To avoid a
 * hydration mismatch we serve the default locale on the server and during
 * the first client render, then resolve the real preference synchronously
 * afterward via `useSyncExternalStore`.
 */
const listeners = new Set<() => void>();
let currentLocale: Locale = DEFAULT_LOCALE;
let initialized = false;

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  const resolved =
    stored && (LOCALES as readonly string[]).includes(stored)
      ? stored
      : resolveLocale(window.navigator.language);
  currentLocale = resolved;
}

function subscribe(cb: () => void) {
  init();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function setLocale(next: Locale) {
  if (next === currentLocale) return;
  currentLocale = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
  }
  listeners.forEach((l) => l());
}

/**
 * Keeps `<html lang>` and the document title/description in sync with the
 * active locale. With `output: "export"` we cannot bake per-locale metadata
 * at build time, so this is a best-effort runtime update.
 */
function useSyncDocumentMetadata(locale: Locale) {
  useEffect(() => {
    document.documentElement.lang = locale;
    const common = dictionaries[locale].common;
    document.title = common.metadata.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", common.metadata.description);
  }, [locale]);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useSyncDocumentMetadata(locale);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/**
 * Returns the strings for the given namespace in the active locale.
 */
export function useTranslation<N extends Namespace>(namespace: N) {
  const { locale } = useLocale();
  return dictionaries[locale][namespace];
}
