import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { jobs, startups, users } from '@/lib/db/schema'
import { eq, and, gte, desc, or, ilike } from 'drizzle-orm'
import JobFilters from './JobFilters'

export const metadata = {
  title: 'Jobs | AGI House India',
  description: 'Find AI and tech jobs at AGI House member companies',
}

const jobTypeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'internship': 'Internship',
}

const locationTypeLabels: Record<string, string> = {
  'remote': 'Remote',
  'hybrid': 'Hybrid',
  'onsite': 'On-site',
}

const locationTypeColors: Record<string, string> = {
  'remote': 'bg-green-600/20 text-green-400',
  'hybrid': 'bg-blue-600/20 text-blue-400',
  'onsite': 'bg-orange-600/20 text-orange-400',
}

interface SearchParams {
  type?: string
  location?: string
  city?: string
  q?: string
}

async function getJobs(searchParams: SearchParams) {
  const now = new Date()
  const conditions = [
    eq(jobs.isActive, true),
    or(eq(jobs.expiresAt, null as unknown as Date), gte(jobs.expiresAt, now)),
  ]

  let jobsData = await db
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
      startupId: startups.id,
      startupName: startups.name,
      startupLogo: startups.logoUrl,
      startupStage: startups.stage,
    })
    .from(jobs)
    .innerJoin(startups, eq(jobs.startupId, startups.id))
    .where(and(...conditions.filter(Boolean)))
    .orderBy(desc(jobs.isFeatured), desc(jobs.createdAt))

  // Apply filters
  if (searchParams.type && searchParams.type !== 'all') {
    jobsData = jobsData.filter((job) => job.jobType === searchParams.type)
  }

  if (searchParams.location && searchParams.location !== 'all') {
    jobsData = jobsData.filter((job) => job.locationType === searchParams.location)
  }

  if (searchParams.city && searchParams.city !== 'All') {
    jobsData = jobsData.filter((job) =>
      job.city?.toLowerCase().includes(searchParams.city!.toLowerCase())
    )
  }

  if (searchParams.q) {
    const query = searchParams.q.toLowerCase()
    jobsData = jobsData.filter((job) => {
      const searchableText = [
        job.title,
        job.description,
        job.startupName,
        ...(job.skills || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return searchableText.includes(query)
    })
  }

  return jobsData
}

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (!min && !max) return null
  const cur = currency || 'INR'
  const format = (n: number) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }
  if (min && max) return `${cur} ${format(min)} - ${format(max)}`
  if (min) return `${cur} ${format(min)}+`
  if (max) return `Up to ${cur} ${format(max)}`
  return null
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(date).toLocaleDateString()
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const jobsList = await getJobs(params)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">AI Jobs</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Find your next role at AI-first companies in India
        </p>
        <p className="text-secondary-white mt-2">{jobsList.length} open positions</p>
      </div>

      <Suspense fallback={<div className="h-20 bg-gray-800 rounded-lg animate-pulse" />}>
        <JobFilters />
      </Suspense>

      {jobsList.length > 0 ? (
        <div className="space-y-4">
          {jobsList.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
              <div className={`glassmorphism rounded-xl p-6 hover:scale-[1.01] transition-transform ${job.isFeatured ? 'border-2 border-purple-500/50' : ''}`}>
                <div className="flex items-start gap-4">
                  {job.startupLogo ? (
                    <Image
                      src={job.startupLogo}
                      alt={job.startupName}
                      width={56}
                      height={56}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl text-white font-bold">
                        {job.startupName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-secondary-white">{job.startupName}</p>
                      </div>
                      {job.isFeatured && (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex-shrink-0">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {job.locationType && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${locationTypeColors[job.locationType]}`}>
                          {locationTypeLabels[job.locationType]}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {jobTypeLabels[job.jobType]}
                        </span>
                      )}
                      {job.city && (
                        <span className="text-secondary-white text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.city}
                        </span>
                      )}
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency) && (
                        <span className="text-green-400 text-sm font-medium">
                          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </span>
                      )}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skills.slice(0, 4).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-gray-800 rounded text-xs text-secondary-white"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-2 py-0.5 text-xs text-secondary-white">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-secondary-white text-sm flex-shrink-0 hidden sm:block">
                    {timeAgo(job.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glassmorphism rounded-xl p-8 inline-block">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
            <p className="text-secondary-white mb-4">Check back soon for new opportunities!</p>
          </div>
        </div>
      )}

      {/* Post a Job CTA */}
      <div className="mt-12 text-center">
        <div className="glassmorphism rounded-xl p-8 inline-block">
          <h2 className="text-xl font-bold text-white mb-2">Hiring for your AI startup?</h2>
          <p className="text-secondary-white mb-4">
            Post your job and reach the AGI House community
          </p>
          <Link
            href="/jobs/post"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </div>
  )
}
