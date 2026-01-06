import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forumThreads, forumReplies, profiles } from '@/lib/db/schema'
import { getSession } from '@/lib/auth-server'
import { eq, sql } from 'drizzle-orm'

interface RouteContext {
  params: Promise<{ slug: string }>
}

// POST - Add reply to thread
export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is approved
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1)

    if (!profile[0]?.isApproved) {
      return NextResponse.json(
        { error: 'Your profile must be approved to post replies' },
        { status: 403 }
      )
    }

    const { slug } = await context.params
    const body = await request.json()
    const { content, parentId } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Get thread
    const threads = await db
      .select()
      .from(forumThreads)
      .where(eq(forumThreads.slug, slug))
      .limit(1)

    const thread = threads[0]
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    if (thread.isLocked) {
      return NextResponse.json({ error: 'This thread is locked' }, { status: 403 })
    }

    // Create reply
    const [reply] = await db
      .insert(forumReplies)
      .values({
        threadId: thread.id,
        authorId: session.user.id,
        content: content.trim(),
        parentId: parentId || null,
      })
      .returning({ id: forumReplies.id })

    // Update thread reply count and last reply info
    await db
      .update(forumThreads)
      .set({
        replyCount: sql`${forumThreads.replyCount} + 1`,
        lastReplyAt: new Date(),
        lastReplyById: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(forumThreads.id, thread.id))

    return NextResponse.json({ id: reply.id })
  } catch (error) {
    console.error('Create reply error:', error)
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 })
  }
}
