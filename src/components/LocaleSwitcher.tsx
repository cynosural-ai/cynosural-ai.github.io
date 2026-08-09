"use client";

import clsx from "clsx";
import { useLocale } from "@/i18n/LocaleProvider";
import { LOCALES, type Locale } from "@/i18n/config";

/**
 * Inline EN | ES button group. Lives in the Footer; previously rendered in the
 * Navbar. Kept as its own component so it can be reused and so the consumers
 * don't each need to wire up `useLocale` themselves.
 */
export default function LocaleSwitcher({
  ariaLabel,
  onDark = false,
}: {
  ariaLabel: string;
  onDark?: boolean;
}) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-1 text-xs font-semibold"
      role="group"
      aria-label={ariaLabel}
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={clsx(
              "px-1.5 py-1 rounded transition-colors",
              locale === l
                ? onDark
                  ? "text-white"
                  : "text-[#003366]"
                : onDark
                  ? "text-white/70 hover:text-white"
                  : "text-gray-400 hover:text-[#209BD0]"
            )}
          >
            {l.toUpperCase()}
          </button>
          {i < (LOCALES as readonly Locale[]).length - 1 && (
            <span className={onDark ? "text-white/40" : "text-gray-300"}>|</span>
          )}
        </span>
      ))}
    </div>
  );
}
