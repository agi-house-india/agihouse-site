import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { profiles, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendApprovalEmail } from '@/lib/email'

// Get all members (admin only)
export async function GET() {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (!dbUser?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const members = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      role: profiles.role,
      company: profiles.company,
      city: profiles.city,
      isApproved: profiles.isApproved,
      isVerified: profiles.isVerified,
      createdAt: profiles.createdAt,
    })
    .from(user)
    .leftJoin(profiles, eq(user.id, profiles.id))

  return NextResponse.json(members)
}

// Update member approval status (admin only)
export async function PATCH(request: Request) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (!dbUser?.isAdmin) {
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

  // Send approval email when member is approved
  if (isApproved === true) {
    const member = await db.query.user.findFirst({
      where: eq(user.id, memberId),
    })

    if (member?.email) {
      const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || 'https://agihouse.in'
      await sendApprovalEmail({
        to: member.email,
        name: member.name || '',
        profileUrl: `${baseUrl}/members/${memberId}`,
      })
    }
  }

  return NextResponse.json({ success: true })
}
