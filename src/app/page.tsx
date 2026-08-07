"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n/LocaleProvider";

export default function Home() {
  const t = useTranslation("home");

  return (
    // Hero fills the exact space between the navbar and footer. The layout's
    // <main> is a flex column, so flex-grow here absorbs the remaining viewport
    // height — no hard-coded calc, and the page never overflows on the home route.
    <section className="flex-grow overflow-hidden bg-white flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        <h1 className="flex items-center justify-center gap-4 text-5xl md:text-7xl font-jost tracking-tight leading-[1.2] text-[#147ca6] mb-8">
          {t.hero.title}
          <Image
            src="/blue.svg"
            alt=""
            width={72}
            height={72}
            className="w-16 h-16 md:w-24 md:h-24"
          />
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>
      </motion.div>
    </section>
  );
}
