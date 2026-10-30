"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ArticleHeading } from "@/lib/article-headings";

export default function ArticleSidebar({ sections, children }: { sections: readonly ArticleHeading[]; children?: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      let nextActiveSection: string | null = null;
      for (const { id } of sections) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= 120) nextActiveSection = id;
        else break;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        nextActiveSection = sections.at(-1)?.id ?? null;
      }
      setActiveSection((current) => current === nextActiveSection ? current : nextActiveSection);
    };
    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <aside className="article-sidebar">
      <nav aria-label="On this page">
        <p>On this page</p>
        {sections.map(({ id, label }) => (
          <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>{label}</a>
        ))}
        {children}
      </nav>
    </aside>
  );
}
