import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/lib/mdx'
import { format } from 'date-fns'

export const metadata = {
  title: 'Blog | AGI House India',
  description: 'Insights, stories, and learnings from India\'s AI ecosystem',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Insights from India&apos;s AI Builders
        </h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Stories, learnings, and perspectives from founders, investors, and builders in India&apos;s AI ecosystem
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-secondary-white text-lg">
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="glassmorphism rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
                {post.frontmatter.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.frontmatter.coverImage}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-secondary-white mb-3">
                    <time dateTime={post.frontmatter.date}>
                      {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-secondary-white line-clamp-2">
                    {post.frontmatter.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    {post.frontmatter.authorImage && (
                      <Image
                        src={post.frontmatter.authorImage}
                        alt={post.frontmatter.author}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm text-white">
                      {post.frontmatter.author}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
