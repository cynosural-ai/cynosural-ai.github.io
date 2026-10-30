import { notFound } from "next/navigation";
import { ArrowUpRight, Github } from "lucide-react";
import { getPost, getPostSlugs, type PostLink } from "@/lib/posts";
import ArticleLayout from "@/components/ArticleLayout";
import ArticleSidebar from "@/components/ArticleSidebar";
import "./post.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    return { title: `${post.title} | Cynosural AI Lab`, description: post.description };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try { post = await getPost(slug); } catch { notFound(); }

  return (
    <div className="article-page blog-post">
      <ArticleLayout sidebar={post.headings.length > 0 || post.links?.length ? (
        <ArticleSidebar sections={post.headings}>
          {post.links && post.links.length > 0 && (
            <div className="article-sidebar-resources">
              {post.links.map((link: PostLink) => (
                <a className="article-sidebar-resource" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.icon === "huggingface" ? (
                    <span aria-hidden>🤗</span>
                  ) : (
                    <Github size={14} aria-hidden />
                  )}
                  <span>{link.label}</span>
                  <ArrowUpRight size={12} aria-hidden />
                </a>
              ))}
            </div>
          )}
        </ArticleSidebar>
      ) : undefined}>
        <header className="blog-post-header">
          <p className="blog-post-date">{post.date}</p>
          <h1>{post.title}</h1>
          {post.author && (
            <p className="blog-post-author">{post.author}</p>
          )}
        </header>
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.content }} />
      </ArticleLayout>
    </div>
  );
}
