import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { startups } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import JobPostForm from './JobPostForm'
import Link from 'next/link'

export const metadata = {
  title: 'Post a Job | AGI House India',
  description: 'Post AI and tech jobs to reach the AGI House community',
}

export default async function PostJobPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user has a startup
  const userStartup = await db.query.startups.findFirst({
    where: eq(startups.founderId, session.user.id),
  })

  if (!userStartup) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glassmorphism rounded-2xl p-8 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-4">Register Your Startup First</h1>
          <p className="text-secondary-white mb-6">
            To post jobs, you need to register your startup on AGI House India.
          </p>
          <Link
            href="/startups/register"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Register Startup
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/jobs"
        className="inline-flex items-center text-secondary-white hover:text-white mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Link>

      <div className="glassmorphism rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Post a New Job</h1>
        <p className="text-secondary-white mb-8">
          Posting for <span className="text-purple-400">{userStartup.name}</span>
        </p>

        <JobPostForm startupName={userStartup.name} />
      </div>
    </div>
  )
}
