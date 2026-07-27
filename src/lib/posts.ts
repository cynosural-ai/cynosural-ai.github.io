import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

// Posts are authored as Markdown files here. Drop a new `.md` file in and it
// becomes a post automatically — no code changes required.
const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO 8601, from front matter
  description?: string;
  tags?: string[];
  author?: string; // shown in the byline
  authorUrl?: string; // if set, the byline author links here
  readingTime: number; // minutes, estimated at ~180 wpm
};

export type Post = PostMeta & {
  contentHtml: string;
};

function readRaw(slug: string) {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  return matter(raw);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const slugs = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));

  return slugs
    .map((slug) => getPostMeta(slug))
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostMeta(slug: string): PostMeta | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = readRaw(slug);

  return {
    slug,
    title: String(data.title ?? slug),
    date: data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString(),
    description: data.description ? String(data.description) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    author: data.author ? String(data.author) : undefined,
    authorUrl: data.authorUrl ? String(data.authorUrl) : undefined,
    readingTime: estimateReadingTime(content),
  };
}

export async function getPost(slug: string): Promise<Post | null> {
  const meta = getPostMeta(slug);
  if (!meta) return null;

  const { content } = readRaw(slug);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm) // tables, strikethrough, task lists, autolinks
    .use(remarkMath) // $...$ and $$...$$ math
    .use(remarkRehype, { allowDangerousHtml: true }) // keep raw HTML nodes
    .use(rehypeRaw) // parse that raw HTML (e.g. <details>, <iframe>, <center>)
    .use(rehypeKatex) // render math to KaTeX HTML
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return { ...meta, contentHtml: String(file) };
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
