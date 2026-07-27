import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/posts";
import "katex/dist/katex.min.css";

type Params = { params: Promise<{ slug: string }> };

// Pre-render every post at build time (required for `output: "export"`).
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · Cynosural AI Lab`,
    description: post.description,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-[#209BD0] mb-8 inline-block transition-colors"
        >
          ← Back to blog
        </Link>

        <header className="mb-10">
          <div className="text-sm text-gray-400 mb-2">
            {formatDate(post.date)}
            {post.author && (
              <>
                {" · "}
                {post.authorUrl ? (
                  <a
                    href={post.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#209BD0] transition-colors"
                  >
                    {post.author}
                  </a>
                ) : (
                  <span className="text-gray-500">{post.author}</span>
                )}
              </>
            )}
            {" · "}
            {post.readingTime} min read
          </div>
          <h1 className="text-4xl font-bold font-jost text-gray-900">
            {post.title}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none prose-headings:font-jost prose-headings:text-[#003366] prose-a:text-[#209BD0] prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
