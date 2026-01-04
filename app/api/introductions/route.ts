import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { introductions } from '@/lib/db/schema'

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { targetId, message } = await request.json()

  if (!targetId) {
    return NextResponse.json({ error: 'Target ID required' }, { status: 400 })
  }

  if (targetId === session.user.id) {
    return NextResponse.json({ error: 'Cannot request intro to yourself' }, { status: 400 })
  }

  await db.insert(introductions).values({
    requesterId: session.user.id,
    targetId,
    message,
    status: 'pending',
  })

  return NextResponse.json({ success: true })
}
