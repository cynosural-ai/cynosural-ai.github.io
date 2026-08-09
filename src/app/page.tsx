"use client";

import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n/LocaleProvider";
import PolarisSky from "@/components/PolarisSky";

export default function Home() {
  const t = useTranslation("home");

  return (
    // Hero fills the exact space between the navbar and footer. The layout's
    // <main> is a flex column, so flex-grow here absorbs the remaining viewport
    // height — no hard-coded calc, and the page never overflows on the home route.
    <section className="relative flex-grow overflow-hidden bg-[#060e1c] flex flex-col items-center justify-center text-center px-4">
      {/* Night-sky gradient behind the starfield */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]"
        aria-hidden
      />

      {/* Interactive starfield: twinkling stars, parallax, shooting stars */}
      <PolarisSky />

      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl"
        >
          <h1 className="flex items-center justify-center gap-5 text-5xl md:text-7xl font-jost tracking-tight leading-[1.2] text-white mb-6">
            {t.hero.title}
            <Image
              src="/polaris.svg"
              alt=""
              width={96}
              height={96}
              priority
              className="w-14 h-14 md:w-20 md:h-20"
            />
          </h1>
          <p className="text-xl md:text-2xl text-[#a9c6e2] max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </motion.div>
      </MotionConfig>
    </section>
  );
}
