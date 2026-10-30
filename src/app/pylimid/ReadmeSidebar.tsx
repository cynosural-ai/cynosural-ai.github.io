"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";

const contents = [
  ["installation", "Installation"],
  ["features", "Features"],
  ["example", "Example"],
  ["next-steps", "Documentation"],
] as const;

const repository = "https://github.com/cynosural-ai/pylimid";

export default function ReadmeSidebar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const activationLine = window.scrollY + 120;
      let nextActiveSection: string | null = null;

      for (const [id] of contents) {
        const section = document.getElementById(id);
        if (!section) continue;

        if (section.getBoundingClientRect().top + window.scrollY <= activationLine) {
          nextActiveSection = id;
        } else {
          break;
        }
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
  }, []);

  return (
    <aside className="readme-sidebar">
      <nav aria-label="On this page">
        <p>On this page</p>
        {contents.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
            {label}
          </a>
        ))}
        <a className="readme-sidebar-source" href={repository}>
          <Github size={14} aria-hidden /> Source code <ArrowUpRight size={12} aria-hidden />
        </a>
      </nav>
    </aside>
  );
}
