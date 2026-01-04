import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { jobs, startups, users, profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

interface Props {
  params: Promise<{ id: string }>
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

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (!min && !max) return null
  const cur = currency || 'INR'
  const format = (n: number) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)} LPA`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }
  if (min && max) return `${cur} ${format(min)} - ${format(max)}`
  if (min) return `${cur} ${format(min)}+`
  if (max) return `Up to ${cur} ${format(max)}`
  return null
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  })

  if (!job) return { title: 'Job Not Found' }

  return {
    title: `${job.title} | AGI House India Jobs`,
    description: job.description?.slice(0, 160),
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params

  const jobData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      jobType: jobs.jobType,
      locationType: jobs.locationType,
      city: jobs.city,
      applyUrl: jobs.applyUrl,
      applyEmail: jobs.applyEmail,
      skills: jobs.skills,
      isActive: jobs.isActive,
      createdAt: jobs.createdAt,
      startupId: startups.id,
      startupName: startups.name,
      startupTagline: startups.tagline,
      startupLogo: startups.logoUrl,
      startupWebsite: startups.websiteUrl,
      startupStage: startups.stage,
      startupCity: startups.city,
    })
    .from(jobs)
    .innerJoin(startups, eq(jobs.startupId, startups.id))
    .where(eq(jobs.id, id))
    .limit(1)

  const job = jobData[0]

  if (!job || !job.isActive) {
    notFound()
  }

  const applyLink = job.applyUrl || (job.applyEmail ? `mailto:${job.applyEmail}` : null)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/jobs"
        className="inline-flex items-center text-secondary-white hover:text-white mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Link>

      <div className="glassmorphism rounded-2xl p-8 mb-8">
        {/* Header */}
        <div className="flex items-start gap-6 pb-6 border-b border-gray-700">
          {job.startupLogo ? (
            <Image
              src={job.startupLogo}
              alt={job.startupName}
              width={80}
              height={80}
              className="rounded-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl text-white font-bold">
                {job.startupName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            <Link
              href={`/startups`}
              className="text-xl text-purple-400 hover:text-purple-300"
            >
              {job.startupName}
            </Link>
            {job.startupTagline && (
              <p className="text-secondary-white mt-1">{job.startupTagline}</p>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="py-6 border-b border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {job.locationType && (
              <div>
                <p className="text-secondary-white text-sm">Location Type</p>
                <p className="text-white font-medium">{locationTypeLabels[job.locationType]}</p>
              </div>
            )}
            {job.jobType && (
              <div>
                <p className="text-secondary-white text-sm">Job Type</p>
                <p className="text-white font-medium">{jobTypeLabels[job.jobType]}</p>
              </div>
            )}
            {job.city && (
              <div>
                <p className="text-secondary-white text-sm">City</p>
                <p className="text-white font-medium">{job.city}</p>
              </div>
            )}
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency) && (
              <div>
                <p className="text-secondary-white text-sm">Salary</p>
                <p className="text-green-400 font-medium">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="py-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">About the Role</h2>
          <div className="text-secondary-white whitespace-pre-wrap">{job.description}</div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Requirements</h2>
            <div className="text-secondary-white whitespace-pre-wrap">{job.requirements}</div>
          </div>
        )}

        {/* Apply Button */}
        <div className="pt-6">
          {applyLink ? (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 bg-purple-600 text-white rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors"
            >
              Apply Now
            </a>
          ) : (
            <p className="text-center text-secondary-white">
              Contact the company directly to apply for this position.
            </p>
          )}
        </div>
      </div>

      {/* Company Info */}
      <div className="glassmorphism rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">About {job.startupName}</h2>
        <div className="flex flex-wrap gap-4">
          {job.startupStage && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-secondary-white capitalize">{job.startupStage.replace('-', ' ')} Stage</span>
            </div>
          )}
          {job.startupCity && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-secondary-white">{job.startupCity}</span>
            </div>
          )}
          {job.startupWebsite && (
            <a
              href={job.startupWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
