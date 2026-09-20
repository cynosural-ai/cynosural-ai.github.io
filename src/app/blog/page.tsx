import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Constellation } from "@/components/Constellation";

export const metadata = {
  title: "Blog | Cynosural AI Lab",
  description: "Writing from Cynosural AI Lab.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="min-h-screen text-white px-6 py-16 relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]" aria-hidden />
      <div className="max-w-4xl w-full mx-auto relative">
      <p className="text-sm uppercase tracking-[0.25em] text-blue-200/60 mb-4">Cynosural AI Lab</p>
      <h1 className="font-jost text-4xl md:text-5xl font-bold tracking-tight text-white mb-12">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-white/10 pb-8">
            <div className="flex items-center gap-5 sm:gap-8">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block h-28 w-28 shrink-0 overflow-hidden transition-opacity hover:opacity-75"
                aria-label={`Read ${post.title}`}
              >
                <Constellation seed={post.constellationSeed ?? post.slug} geometrySize={1.5} starSize={0.5} />
              </Link>
              <div>
                <p className="text-sm text-blue-200/70 mb-2">{post.date}</p>
                <h2 className="font-jost text-3xl text-white mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#209BD0]">{post.title}</Link>
                </h2>
                {post.description && <p className="text-lg text-blue-100/90 leading-relaxed">{post.description}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
