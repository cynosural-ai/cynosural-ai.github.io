import { notFound } from "next/navigation";
import { Github } from "lucide-react";
import { getPost, getPostSlugs, type PostLink } from "@/lib/posts";

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
    <article className="min-h-screen text-white px-6 py-16 relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]" aria-hidden />
      <div className="max-w-3xl w-full mx-auto relative">
        <p className="text-sm text-blue-200/70 mb-4">{post.date}</p>
        <h1 className="font-jost text-5xl mb-4">{post.title}</h1>
        {post.author && (
          <p className="text-sm text-blue-200/70 mb-10">{post.author}</p>
        )}
        {post.links && post.links.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10">
            {post.links.map((link: PostLink) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  link.icon === "huggingface"
                    ? "inline-flex items-center gap-1.5 bg-[#FFD21E] text-gray-900 px-3.5 py-2 rounded-md font-semibold hover:bg-[#FFF0B3] transition-colors text-xs"
                    : "inline-flex items-center gap-1.5 bg-[#24292e] text-white px-3.5 py-2 rounded-md font-semibold hover:bg-[#2f363d] transition-colors text-xs"
                }
              >
                {link.icon === "huggingface" ? (
                  <span role="img" aria-label="Hugging Face" className="text-sm leading-none">🤗</span>
                ) : (
                  <Github className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {link.label}
              </a>
            ))}
          </div>
        )}
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
