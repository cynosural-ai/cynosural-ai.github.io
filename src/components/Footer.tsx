"use client";

import { useTranslation } from "@/i18n/LocaleProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Footer() {
  const t = useTranslation("footer");

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Cynosural AI Lab
          </p>

          <div className="flex items-center justify-center gap-5">
            <a
              href="https://github.com/cynosural-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-[#209BD0] transition-colors"
            >
              {t.resources.github}
            </a>
            <a
              href="https://huggingface.co/cynosural"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-[#209BD0] transition-colors"
            >
              {t.resources.huggingFace}
            </a>
            <LocaleSwitcher ariaLabel={t.langToggle.selectLanguage} />
          </div>
        </div>
      </div>
    </footer>
  );
}
