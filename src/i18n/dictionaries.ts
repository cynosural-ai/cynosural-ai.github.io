import enCommon from "@/dictionaries/en/common.json";
import enNavbar from "@/dictionaries/en/navbar.json";
import enHome from "@/dictionaries/en/home.json";
import enProjects from "@/dictionaries/en/projects.json";
import enHistoricalArchives from "@/dictionaries/en/historicalArchives.json";
import enFooter from "@/dictionaries/en/footer.json";

const dictionaries = {
  common: enCommon,
  navbar: enNavbar,
  home: enHome,
  projects: enProjects,
  historicalArchives: enHistoricalArchives,
  footer: enFooter,
};

export function useTranslation<N extends keyof typeof dictionaries>(namespace: N) {
  return dictionaries[namespace];
}
