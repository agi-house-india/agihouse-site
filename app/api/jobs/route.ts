import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { jobs, startups, profiles } from '@/lib/db/schema'
import { eq, and, gte, desc, or } from 'drizzle-orm'

export async function GET() {
  const now = new Date()

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      jobType: jobs.jobType,
      locationType: jobs.locationType,
      city: jobs.city,
      skills: jobs.skills,
      isFeatured: jobs.isFeatured,
      createdAt: jobs.createdAt,
      startupName: startups.name,
      startupLogo: startups.logoUrl,
    })
    .from(jobs)
    .innerJoin(startups, eq(jobs.startupId, startups.id))
    .where(and(
      eq(jobs.isActive, true),
      or(eq(jobs.expiresAt, null as unknown as Date), gte(jobs.expiresAt, now))
    ))
    .orderBy(desc(jobs.isFeatured), desc(jobs.createdAt))

  return NextResponse.json(jobsData)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user has a startup
  const userStartup = await db.query.startups.findFirst({
    where: eq(startups.founderId, session.user.id),
  })

  if (!userStartup) {
    return NextResponse.json(
      { error: 'You need to register a startup first' },
      { status: 400 }
    )
  }

  const data = await request.json()

  const {
    title,
    description,
    requirements,
    salaryMin,
    salaryMax,
    salaryCurrency,
    jobType,
    locationType,
    city,
    applyUrl,
    applyEmail,
    skills,
  } = data

  if (!title || !description) {
    return NextResponse.json(
      { error: 'Title and description are required' },
      { status: 400 }
    )
  }

  // Set expiry to 30 days from now
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const [newJob] = await db
    .insert(jobs)
    .values({
      startupId: userStartup.id,
      postedById: session.user.id,
      title,
      description,
      requirements,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      salaryCurrency: salaryCurrency || 'INR',
      jobType: jobType || 'full-time',
      locationType: locationType || 'hybrid',
      city,
      applyUrl,
      applyEmail,
      skills: skills || [],
      expiresAt,
    })
    .returning()

  return NextResponse.json(newJob)
}
