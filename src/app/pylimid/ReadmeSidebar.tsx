import { ArrowUpRight, Github } from "lucide-react";
import ArticleSidebar from "@/components/ArticleSidebar";

const contents = [
  { id: "installation", label: "Installation" },
  { id: "features", label: "Features" },
  { id: "example", label: "Example" },
  { id: "next-steps", label: "Documentation" },
] as const;

const repository = "https://github.com/cynosural-ai/pylimid";

export default function ReadmeSidebar() {
  return (
    <ArticleSidebar sections={contents}>
      <a className="article-sidebar-source" href={repository}>
        <Github size={14} aria-hidden /> Source code <ArrowUpRight size={12} aria-hidden />
      </a>
    </ArticleSidebar>
  );
}
