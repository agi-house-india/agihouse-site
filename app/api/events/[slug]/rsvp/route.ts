import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, eventRsvps } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params

  // Find the event by slug
  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  // Check if already registered
  const existingRsvp = await db.query.eventRsvps.findFirst({
    where: and(
      eq(eventRsvps.eventId, event.id),
      eq(eventRsvps.userId, session.user.id)
    ),
  })

  if (existingRsvp) {
    return NextResponse.json({ error: 'Already registered' }, { status: 400 })
  }

  // Check capacity
  if (event.capacity) {
    const rsvpCount = await db
      .select()
      .from(eventRsvps)
      .where(and(
        eq(eventRsvps.eventId, event.id),
        eq(eventRsvps.status, 'registered')
      ))

    if (rsvpCount.length >= event.capacity) {
      // Add to waitlist
      await db.insert(eventRsvps).values({
        eventId: event.id,
        userId: session.user.id,
        status: 'waitlist',
      })
      return NextResponse.json({ status: 'waitlist' })
    }
  }

  // Register
  await db.insert(eventRsvps).values({
    eventId: event.id,
    userId: session.user.id,
    status: 'registered',
  })

  return NextResponse.json({ status: 'registered' })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params

  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  await db
    .delete(eventRsvps)
    .where(and(
      eq(eventRsvps.eventId, event.id),
      eq(eventRsvps.userId, session.user.id)
    ))

  return NextResponse.json({ success: true })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()

  const { slug } = await params

  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  // Get RSVP count
  const rsvps = await db
    .select()
    .from(eventRsvps)
    .where(eq(eventRsvps.eventId, event.id))

  const registered = rsvps.filter((r) => r.status === 'registered').length
  const waitlist = rsvps.filter((r) => r.status === 'waitlist').length

  // Check if current user is registered
  let userStatus = null
  if (session?.user?.id) {
    const userId = session.user.id
    const userRsvp = rsvps.find((r) => r.userId === userId)
    userStatus = userRsvp?.status || null
  }

  return NextResponse.json({
    registered,
    waitlist,
    capacity: event.capacity,
    userStatus,
  })
}
