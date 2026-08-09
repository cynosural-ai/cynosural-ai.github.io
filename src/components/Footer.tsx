"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/i18n/LocaleProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Footer() {
  const t = useTranslation("footer");
  const isHome = usePathname() === "/";

  return (
    <footer
      className={clsx(
        "border-t",
        isHome ? "bg-transparent border-white/10" : "bg-white border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p
            className={clsx(
              "text-xs text-center md:text-left",
              isHome ? "text-white/70" : "text-gray-400"
            )}
          >
            &copy; {new Date().getFullYear()} Cynosural AI Lab
          </p>

          <div className="flex items-center justify-center gap-5">
            <a
              href="https://github.com/cynosural-ai"
              target="_blank"
              rel="noopener noreferrer"
              className={isHome ? "text-white" : "text-gray-900"}
              aria-label={t.resources.github}
            >
              <Image src="/github.svg" alt="" width={14} height={14} className="flex-shrink-0" />
            </a>
            <a
              href="https://huggingface.co/cynosural"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-none"
              aria-label={t.resources.huggingFace}
            >
              <span role="img" aria-label={t.resources.huggingFace}>🤗</span>
            </a>
            <LocaleSwitcher onDark={isHome} ariaLabel={t.langToggle.selectLanguage} />
          </div>
        </div>
      </div>
    </footer>
  );
}
