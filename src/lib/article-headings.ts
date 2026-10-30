import type { Element, Root, RootContent } from "hast";

export type ArticleHeading = { id: string; label: string };

function headingText(node: RootContent): string {
  if (node.type === "text") return node.value;
  return "children" in node ? node.children.map(headingText).join("") : "";
}

/** Add stable anchors and reserve h1 for the article title. */
export function articleHeadings(contents: ArticleHeading[]) {
  return () => (tree: Root) => {
    const headings: Element[] = [];
    const usedIds = new Set<string>();

    const visit = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if (child.properties.id) usedIds.add(String(child.properties.id));
        if (/^h[1-6]$/.test(child.tagName)) headings.push(child);
        visit(child);
      }
    };
    visit(tree);
    if (headings.length === 0) return;

    const topLevel = Math.min(...headings.map((heading) => Number(heading.tagName[1])));
    for (const heading of headings) {
      const level = Number(heading.tagName[1]);
      const label = headingText(heading).replace(/\s+/g, " ").trim();
      const baseId = label.normalize("NFKD").replace(/\p{M}/gu, "")
        .toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/[\s-]+/g, "-") || "section";
      let id = heading.properties.id ? String(heading.properties.id) : baseId;
      if (!heading.properties.id) {
        let suffix = 2;
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      }
      usedIds.add(id);
      heading.properties.id = id;
      heading.tagName = `h${Math.min(6, level - topLevel + 2)}`;
      if (level === topLevel && label) contents.push({ id, label });
    }
  };
}
