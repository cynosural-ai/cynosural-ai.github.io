"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { LOCALES, type Locale } from "@/i18n/config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslation("navbar");
  const { locale, setLocale } = useLocale();

  const navigation = [
    { name: t.links.historicalArchives, href: "/historical-archives" },
    { name: t.links.about, href: "/about" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-jost text-xl text-gray-900 tracking-tight">Cynosural</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-[#209BD0] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <LocaleSwitcher locale={locale} setLocale={setLocale} ariaLabel={t.langToggle.selectLanguage} />
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">{t.langToggle.selectLanguage}</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-100 shadow-lg">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#209BD0] hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-2">
            <LocaleSwitcher locale={locale} setLocale={setLocale} ariaLabel={t.langToggle.selectLanguage} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function LocaleSwitcher({
  locale,
  setLocale,
  ariaLabel,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-1 text-xs font-semibold" role="group" aria-label={ariaLabel}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={clsx(
              "px-1.5 py-1 rounded transition-colors",
              locale === l ? "text-[#003366]" : "text-gray-400 hover:text-[#209BD0]"
            )}
          >
            {l.toUpperCase()}
          </button>
          {i < LOCALES.length - 1 && <span className="text-gray-300">|</span>}
        </span>
      ))}
    </div>
  );
}
