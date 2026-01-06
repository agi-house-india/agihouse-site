import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { introductions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  if (!['accepted', 'declined', 'completed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Only the target can accept/decline
  const intro = await db.query.introductions.findFirst({
    where: eq(introductions.id, id),
  })

  if (!intro) {
    return NextResponse.json({ error: 'Introduction not found' }, { status: 404 })
  }

  if (intro.targetId !== session.user.id) {
    return NextResponse.json({ error: 'Not authorized to update this request' }, { status: 403 })
  }

  await db
    .update(introductions)
    .set({ status, updatedAt: new Date() })
    .where(eq(introductions.id, id))

  return NextResponse.json({ success: true })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const intro = await db.query.introductions.findFirst({
    where: eq(introductions.id, id),
  })

  if (!intro) {
    return NextResponse.json({ error: 'Introduction not found' }, { status: 404 })
  }

  // Only requester or target can view
  if (intro.requesterId !== session.user.id && intro.targetId !== session.user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  return NextResponse.json(intro)
}
