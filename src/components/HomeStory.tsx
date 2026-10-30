"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/i18n/dictionaries";

export default function HomeStory() {
  const home = useTranslation("home");
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 65%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.65, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [16, 0]);

  return (
    <motion.section
      ref={ref}
      id="about"
      aria-labelledby="home-about-title"
      className="home-story"
      style={{ opacity: reducedMotion ? 1 : opacity, y: reducedMotion ? 0 : y }}
    >
      <h2 id="home-about-title">{home.story.heading}</h2>
      <p>{home.story.intro}</p>
      <p>{home.story.research}</p>
      <p>{home.story.approach}</p>
      <nav className="home-story-links" aria-label={home.story.linksLabel}>
        <Link href="/pylimid">PyLIMID</Link>
        <Link href="/blog">{home.story.blogLink}</Link>
      </nav>
    </motion.section>
  );
}
