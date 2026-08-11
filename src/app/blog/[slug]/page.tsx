import { notFound } from "next/navigation";
import { getPost, getPostSlugs } from "@/lib/posts";

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
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
