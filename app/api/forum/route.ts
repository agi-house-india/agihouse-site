import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forumThreads, profiles } from '@/lib/db/schema'
import { getSession } from '@/lib/auth-server'
import { eq } from 'drizzle-orm'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

// POST - Create new thread
export async function POST(request: Request) {
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
        { error: 'Your profile must be approved to create discussions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const baseSlug = slugify(title)
    const timestamp = Date.now().toString(36)
    const slug = `${baseSlug}-${timestamp}`

    const validCategories = [
      'general',
      'introductions',
      'fundraising',
      'hiring',
      'product',
      'technical',
      'events',
      'resources',
    ]

    const finalCategory = validCategories.includes(category) ? category : 'general'

    const [thread] = await db
      .insert(forumThreads)
      .values({
        authorId: session.user.id,
        title: title.trim(),
        slug,
        content: content.trim(),
        category: finalCategory,
      })
      .returning({ id: forumThreads.id, slug: forumThreads.slug })

    return NextResponse.json({ id: thread.id, slug: thread.slug })
  } catch (error) {
    console.error('Create thread error:', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
