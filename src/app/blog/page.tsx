import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog · Cynosural AI Lab",
  description: "Notes and updates from our open AI research.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-jost text-gray-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600 mb-12">
          Notes and updates from our open AI research.
        </p>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet — check back soon.</p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="text-sm text-gray-400 mb-1">
                    {formatDate(post.date)}
                    {post.author && ` · ${post.author}`}
                    {" · "}
                    {post.readingTime} min read
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-[#209BD0] transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
