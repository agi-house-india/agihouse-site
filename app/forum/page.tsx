import { db } from '@/lib/db'
import { forumThreads, users, profiles } from '@/lib/db/schema'
import { desc, eq, sql, and, ilike } from 'drizzle-orm'
import Link from 'next/link'
import ForumFilters from './ForumFilters'

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  introductions: 'Introductions',
  fundraising: 'Fundraising',
  hiring: 'Hiring',
  product: 'Product',
  technical: 'Technical',
  events: 'Events',
  resources: 'Resources',
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-600/20 text-gray-400 border-gray-500/30',
  introductions: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  fundraising: 'bg-green-600/20 text-green-400 border-green-500/30',
  hiring: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  product: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
  technical: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
  events: 'bg-pink-600/20 text-pink-400 border-pink-500/30',
  resources: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
}

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ForumPage({ searchParams }: Props) {
  const params = await searchParams
  const category = params.category
  const search = params.search

  const conditions = []
  if (category && category !== 'all') {
    conditions.push(eq(forumThreads.category, category as typeof forumThreads.category.enumValues[number]))
  }
  if (search) {
    conditions.push(
      sql`(${forumThreads.title} ILIKE ${'%' + search + '%'} OR ${forumThreads.content} ILIKE ${'%' + search + '%'})`
    )
  }

  const threads = await db
    .select({
      id: forumThreads.id,
      title: forumThreads.title,
      slug: forumThreads.slug,
      content: forumThreads.content,
      category: forumThreads.category,
      isPinned: forumThreads.isPinned,
      isLocked: forumThreads.isLocked,
      viewCount: forumThreads.viewCount,
      replyCount: forumThreads.replyCount,
      lastReplyAt: forumThreads.lastReplyAt,
      createdAt: forumThreads.createdAt,
      authorName: users.name,
      authorImage: users.image,
      authorTitle: profiles.title,
      authorCompany: profiles.company,
    })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.authorId, users.id))
    .leftJoin(profiles, eq(forumThreads.authorId, profiles.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastReplyAt), desc(forumThreads.createdAt))
    .limit(50)

  const categoryCounts = await db
    .select({
      category: forumThreads.category,
      count: sql<number>`count(*)::int`,
    })
    .from(forumThreads)
    .groupBy(forumThreads.category)

  const categoryCountMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c.count])
  )

  return (
    <main className="min-h-screen bg-primary-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Discussion Forum</h1>
            <p className="text-secondary-white">
              Connect, share ideas, and learn from the AI community
            </p>
          </div>
          <Link
            href="/forum/new"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Start Discussion
          </Link>
        </div>

        {/* Filters */}
        <ForumFilters
          currentCategory={category}
          currentSearch={search}
          categoryCounts={categoryCountMap}
        />

        {/* Thread List */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-secondary-white text-lg mb-4">No discussions yet</p>
              <Link
                href="/forum/new"
                className="text-purple-400 hover:text-purple-300"
              >
                Be the first to start a conversation
              </Link>
            </div>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${thread.slug}`}
                className="block p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {thread.authorImage ? (
                      <img
                        src={thread.authorImage}
                        alt={thread.authorName || 'Author'}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-medium">
                        {thread.authorName?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {thread.isPinned && (
                        <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                          Pinned
                        </span>
                      )}
                      {thread.isLocked && (
                        <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded border border-red-500/30">
                          Locked
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs rounded border ${CATEGORY_COLORS[thread.category || 'general']}`}
                      >
                        {CATEGORY_LABELS[thread.category || 'general']}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-white mb-1 truncate">
                      {thread.title}
                    </h2>

                    <p className="text-secondary-white text-sm line-clamp-2 mb-3">
                      {thread.content?.slice(0, 200)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {thread.authorName}
                        {thread.authorTitle && ` · ${thread.authorTitle}`}
                        {thread.authorCompany && ` at ${thread.authorCompany}`}
                      </span>
                      <span>·</span>
                      <span>{thread.replyCount || 0} replies</span>
                      <span>·</span>
                      <span>{thread.viewCount || 0} views</span>
                      <span>·</span>
                      <span>
                        {thread.lastReplyAt
                          ? formatRelativeTime(thread.lastReplyAt)
                          : formatRelativeTime(thread.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
