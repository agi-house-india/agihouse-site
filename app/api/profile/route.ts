import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  })

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  return NextResponse.json({
    ...user,
    profile,
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  })

  if (existingProfile) {
    // Update existing profile
    await db.update(profiles)
      .set({
        role: data.role,
        bio: data.bio,
        company: data.company,
        title: data.title,
        city: data.city,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
        websiteUrl: data.websiteUrl,
        interests: data.interests || [],
        lookingFor: data.lookingFor || [],
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, session.user.id))
  } else {
    // Create new profile
    await db.insert(profiles).values({
      id: session.user.id,
      role: data.role,
      bio: data.bio,
      company: data.company,
      title: data.title,
      city: data.city,
      linkedinUrl: data.linkedinUrl,
      twitterUrl: data.twitterUrl,
      websiteUrl: data.websiteUrl,
      interests: data.interests || [],
      lookingFor: data.lookingFor || [],
    })
  }

  return NextResponse.json({ success: true })
}
