import type { Locale } from "./config";

import enCommon from "@/dictionaries/en/common.json";
import enNavbar from "@/dictionaries/en/navbar.json";
import enHome from "@/dictionaries/en/home.json";
import enAbout from "@/dictionaries/en/about.json";
import enProjects from "@/dictionaries/en/projects.json";
import enHistoricalArchives from "@/dictionaries/en/historicalArchives.json";
import enFooter from "@/dictionaries/en/footer.json";

import esCommon from "@/dictionaries/es/common.json";
import esNavbar from "@/dictionaries/es/navbar.json";
import esHome from "@/dictionaries/es/home.json";
import esAbout from "@/dictionaries/es/about.json";
import esProjects from "@/dictionaries/es/projects.json";
import esHistoricalArchives from "@/dictionaries/es/historicalArchives.json";
import esFooter from "@/dictionaries/es/footer.json";

/**
 * Namespaces map 1:1 to the per-page dictionary files. The English dictionaries
 * are the source of truth for the shape; the Spanish ones must match key-for-key,
 * which TypeScript enforces via `Dictionary`.
 */
const en = {
  common: enCommon,
  navbar: enNavbar,
  home: enHome,
  about: enAbout,
  projects: enProjects,
  historicalArchives: enHistoricalArchives,
  footer: enFooter,
};

export type Namespace = keyof typeof en;

/**
 * A dictionary bundle is a record of every namespace's strings. Typing the ES
 * bundle against the same shape surfaces any key drift between locales at
 * build time rather than at runtime.
 */
export type Dictionary = typeof en;

const es: Dictionary = {
  common: esCommon,
  navbar: esNavbar,
  home: esHome,
  about: esAbout,
  projects: esProjects,
  historicalArchives: esHistoricalArchives,
  footer: esFooter,
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };
