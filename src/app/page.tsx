"use client";

import { useRef } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n/dictionaries";
import PolarisSky from "@/components/PolarisSky";
import HomeStory from "@/components/HomeStory";
import "./home.css";

export default function Home() {
  const t = useTranslation("home");
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const skyOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.12, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="home-page">
        <div
          className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]"
          aria-hidden
        >
          <motion.div className="absolute inset-0" style={{ opacity: skyOpacity }}>
            <PolarisSky />
          </motion.div>
        </div>

        <section ref={heroRef} className="home-hero" aria-labelledby="home-title">
          <motion.div style={{ opacity: reducedMotion ? 1 : titleOpacity, y: reducedMotion ? 0 : titleY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative max-w-4xl"
            >
              <h1 id="home-title" className="flex items-center justify-center gap-5 text-5xl md:text-7xl font-jost tracking-tight leading-[1.2] text-white mb-6">
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
          </motion.div>
        </section>
        <HomeStory />
      </div>
    </MotionConfig>
  );
}
