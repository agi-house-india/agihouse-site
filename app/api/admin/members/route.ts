import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Get all members (admin only)
export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      isAdmin: users.isAdmin,
      role: profiles.role,
      company: profiles.company,
      city: profiles.city,
      isApproved: profiles.isApproved,
      isVerified: profiles.isVerified,
      createdAt: profiles.createdAt,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.id))

  return NextResponse.json(members)
}

// Update member approval status (admin only)
export async function PATCH(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { memberId, isApproved, isVerified } = await request.json()

  if (!memberId) {
    return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
  }

  const updates: Record<string, boolean | Date> = { updatedAt: new Date() }
  if (typeof isApproved === 'boolean') updates.isApproved = isApproved
  if (typeof isVerified === 'boolean') updates.isVerified = isVerified

  await db.update(profiles)
    .set(updates)
    .where(eq(profiles.id, memberId))

  return NextResponse.json({ success: true })
}
