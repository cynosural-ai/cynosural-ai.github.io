import type { ReactNode } from "react";
import "./article.css";

export default function ArticleLayout({ sidebar, children }: { sidebar?: ReactNode; children: ReactNode }) {
  return (
    <div className={`article-layout${sidebar ? "" : " article-layout-wide"}`}>
      {sidebar}
      <article className="article-content">{children}</article>
    </div>
  );
}
