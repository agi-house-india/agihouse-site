import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profiles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// One-time setup to make the first user an admin
// This should be called once and then removed or disabled
export async function POST(request: Request) {
  const { email, secret } = await request.json()

  // Simple secret check - in production use env var
  if (secret !== 'agihouse-setup-2024') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Find user by email
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Make user admin
  await db.update(users)
    .set({ isAdmin: true })
    .where(eq(users.id, user.id))

  // Approve their profile
  await db.update(profiles)
    .set({ isApproved: true, isVerified: true })
    .where(eq(profiles.id, user.id))

  return NextResponse.json({ success: true, message: `${email} is now an admin` })
}
