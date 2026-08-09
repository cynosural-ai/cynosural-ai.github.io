"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "@/i18n/LocaleProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const t = useTranslation("navbar");

  const navigation = [
    { name: t.links.historicalArchives, href: "/historical-archives" },
    { name: t.links.about, href: "/about" },
  ];

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 border-b",
        isHome ? "bg-transparent border-transparent" : "bg-white border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={clsx("relative flex h-16", isHome ? "justify-center" : "justify-between")}>
          {/* Brand — hidden on the home page (Sakana-style) */}
          {!isHome && (
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <Image
                  src="/blue.svg"
                  alt="Cynosural"
                  width={28}
                  height={28}
                  priority
                />
                <span className="font-jost text-xl text-[#147ca6] tracking-tight">Cynosural</span>
              </Link>
            </div>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isHome
                    ? "text-white/70 hover:text-white"
                    : "text-gray-600 hover:text-[#209BD0]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden absolute right-0 inset-y-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                "inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                isHome
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              )}
              aria-label={t.menu.toggle}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "fixed inset-0 z-50 md:hidden flex flex-col",
              isHome
                ? "bg-[#0a1f3d]/95 backdrop-blur-md"
                : "bg-white"
            )}
          >
            <div className="flex items-center justify-between px-4 h-16">
              <span
                className={clsx(
                  "font-jost text-xl tracking-tight",
                  isHome ? "text-white" : "text-[#147ca6]"
                )}
              >
                Cynosural
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "inline-flex items-center justify-center p-2 rounded-md",
                  isHome
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                )}
                aria-label={t.menu.toggle}
              >
                <X className="block h-6 w-6" />
              </button>
            </div>
            <nav className="flex-grow flex flex-col items-center justify-center gap-2 px-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "block px-4 py-3 rounded-md text-xl font-medium",
                    isHome
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-[#209BD0] hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
}
