import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { format } from 'date-fns'
import { getAllBlogPosts, getBlogPost } from '@/lib/mdx'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.frontmatter.title} | AGI House India`,
    description: post.frontmatter.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-secondary-white hover:text-white mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      <header className="mb-8">
        {post.frontmatter.coverImage && (
          <div className="relative h-64 sm:h-96 w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.frontmatter.coverImage}
              alt={post.frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-secondary-white mb-4">
          <time dateTime={post.frontmatter.date}>
            {format(new Date(post.frontmatter.date), 'MMMM d, yyyy')}
          </time>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {post.frontmatter.title}
        </h1>

        <p className="text-xl text-secondary-white mb-6">
          {post.frontmatter.excerpt}
        </p>

        <div className="flex items-center gap-3 pb-8 border-b border-gray-700">
          {post.frontmatter.authorImage && (
            <Image
              src={post.frontmatter.authorImage}
              alt={post.frontmatter.author}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-white font-medium">{post.frontmatter.author}</p>
            {post.frontmatter.authorRole && (
              <p className="text-secondary-white text-sm">{post.frontmatter.authorRole}</p>
            )}
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <MDXRemote source={post.content} />
      </div>

      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 text-secondary-white rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
