import { db } from '@/lib/db'
import { forumThreads, forumReplies, user, profiles } from '@/lib/db/schema'
import { eq, asc, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReplyForm from './ReplyForm'
import { getSession } from '@/lib/auth-server'

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
  params: Promise<{ slug: string }>
}

export default async function ThreadPage({ params }: Props) {
  const { slug } = await params
  const session = await getSession()

  // Get thread with author info
  const threadResults = await db
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
      createdAt: forumThreads.createdAt,
      authorId: forumThreads.authorId,
      authorName: user.name,
      authorImage: user.image,
      authorTitle: profiles.title,
      authorCompany: profiles.company,
      authorRole: profiles.role,
    })
    .from(forumThreads)
    .leftJoin(user, eq(forumThreads.authorId, user.id))
    .leftJoin(profiles, eq(forumThreads.authorId, profiles.id))
    .where(eq(forumThreads.slug, slug))
    .limit(1)

  const thread = threadResults[0]
  if (!thread) {
    notFound()
  }

  // Increment view count
  await db
    .update(forumThreads)
    .set({ viewCount: sql`${forumThreads.viewCount} + 1` })
    .where(eq(forumThreads.id, thread.id))

  // Get replies
  const replies = await db
    .select({
      id: forumReplies.id,
      content: forumReplies.content,
      createdAt: forumReplies.createdAt,
      isEdited: forumReplies.isEdited,
      authorId: forumReplies.authorId,
      authorName: user.name,
      authorImage: user.image,
      authorTitle: profiles.title,
      authorCompany: profiles.company,
      authorRole: profiles.role,
    })
    .from(forumReplies)
    .leftJoin(user, eq(forumReplies.authorId, user.id))
    .leftJoin(profiles, eq(forumReplies.authorId, profiles.id))
    .where(eq(forumReplies.threadId, thread.id))
    .orderBy(asc(forumReplies.createdAt))

  return (
    <main className="min-h-screen bg-primary-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/forum"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            &larr; Back to Forum
          </Link>
        </div>

        {/* Thread Header */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
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

          <h1 className="text-2xl font-bold text-white mb-6">{thread.title}</h1>

          <div className="flex items-start gap-4">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              {thread.authorImage ? (
                <img
                  src={thread.authorImage}
                  alt={thread.authorName || 'Author'}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-medium text-lg">
                  {thread.authorName?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Author Info & Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{thread.authorName}</span>
                {thread.authorRole && (
                  <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded">
                    {thread.authorRole}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {thread.authorTitle}
                {thread.authorCompany && ` at ${thread.authorCompany}`}
                {' · '}
                {formatDate(thread.createdAt)}
              </p>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{thread.content}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-4 text-sm text-gray-500">
            <span>{thread.viewCount || 0} views</span>
            <span>{thread.replyCount || 0} replies</span>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-white">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {replies.length === 0 ? (
            <p className="text-secondary-white py-8 text-center">
              No replies yet. Be the first to respond!
            </p>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-gray-900/30 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Reply Author Avatar */}
                  <div className="flex-shrink-0">
                    {reply.authorImage ? (
                      <img
                        src={reply.authorImage}
                        alt={reply.authorName || 'Author'}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-medium">
                        {reply.authorName?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  {/* Reply Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{reply.authorName}</span>
                      {reply.authorRole && (
                        <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded">
                          {reply.authorRole}
                        </span>
                      )}
                      {reply.authorId === thread.authorId && (
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded">
                          OP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {reply.authorTitle}
                      {reply.authorCompany && ` at ${reply.authorCompany}`}
                      {' · '}
                      {formatDate(reply.createdAt)}
                      {reply.isEdited && ' · edited'}
                    </p>

                    <p className="text-gray-300 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        {thread.isLocked ? (
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-secondary-white">This thread is locked and no longer accepting replies.</p>
          </div>
        ) : session?.user ? (
          <ReplyForm threadId={thread.id} threadSlug={thread.slug} />
        ) : (
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-secondary-white mb-4">Sign in to reply to this discussion</p>
            <Link
              href="/auth/signin"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
