import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { profiles, users } from '@/lib/db/schema'
import { eq, and, ilike, or, sql } from 'drizzle-orm'
import MemberFilters from './MemberFilters'

export const metadata = {
  title: 'Members | AGI House India',
  description: 'Connect with AI founders, investors, and builders across India',
}

const roleLabels: Record<string, string> = {
  founder: 'Founder',
  investor: 'Investor',
  talent: 'Talent',
  enterprise: 'Enterprise',
  community: 'Community',
}

const roleColors: Record<string, string> = {
  founder: 'bg-purple-600/20 text-purple-400',
  investor: 'bg-green-600/20 text-green-400',
  talent: 'bg-blue-600/20 text-blue-400',
  enterprise: 'bg-orange-600/20 text-orange-400',
  community: 'bg-gray-600/20 text-gray-400',
}

interface SearchParams {
  role?: string
  city?: string
  q?: string
}

async function getMembers(searchParams: SearchParams) {
  // Build conditions
  const conditions = [eq(profiles.isApproved, true)]

  if (searchParams.role && searchParams.role !== 'all') {
    conditions.push(eq(profiles.role, searchParams.role as 'founder' | 'investor' | 'talent' | 'enterprise' | 'community'))
  }

  if (searchParams.city && searchParams.city !== 'All') {
    conditions.push(ilike(profiles.city, `%${searchParams.city}%`))
  }

  // Public directory: only show approved members
  let membersData = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: profiles.role,
      title: profiles.title,
      company: profiles.company,
      city: profiles.city,
      bio: profiles.bio,
      isVerified: profiles.isVerified,
      interests: profiles.interests,
      lookingFor: profiles.lookingFor,
    })
    .from(users)
    .innerJoin(profiles, and(eq(users.id, profiles.id), ...conditions))

  // Filter by search query (client-side for now since we need to search across multiple fields)
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase()
    membersData = membersData.filter((member) => {
      const searchableText = [
        member.name,
        member.company,
        member.title,
        member.bio,
        ...(member.interests || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return searchableText.includes(query)
    })
  }

  return membersData
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const members = await getMembers(params)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Member Directory</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Connect with AI founders, investors, and builders across India
        </p>
        <p className="text-secondary-white mt-2">{members.length} members</p>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="flex gap-2 mb-8 justify-center"><div className="h-10 w-96 bg-gray-800 rounded-lg animate-pulse" /></div>}>
        <MemberFilters />
      </Suspense>

      {/* Member Grid */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Link key={member.id} href={`/members/${member.id}`} className="group">
              <div className="glassmorphism rounded-xl p-6 hover:scale-[1.02] transition-transform h-full">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name || ''}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                        <span className="text-xl text-white font-bold">
                          {member.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                        {member.name}
                      </h3>
                      {member.isVerified && (
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-secondary-white text-sm">{member.title}</p>
                    <p className="text-secondary-white text-sm">{member.company}</p>
                  </div>
                </div>

                {member.bio && (
                  <p className="mt-4 text-secondary-white text-sm line-clamp-2">
                    {member.bio}
                  </p>
                )}

                {member.lookingFor && member.lookingFor.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.lookingFor.slice(0, 2).map((item: string) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 bg-purple-600/10 border border-purple-500/20 rounded text-xs text-purple-400"
                      >
                        {item}
                      </span>
                    ))}
                    {member.lookingFor.length > 2 && (
                      <span className="px-2 py-0.5 text-xs text-secondary-white">
                        +{member.lookingFor.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  {member.role && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[member.role] || roleColors.community}`}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  )}
                  {member.city && (
                    <span className="text-secondary-white text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {member.city}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glassmorphism rounded-xl p-8 inline-block">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No members yet</h3>
            <p className="text-secondary-white mb-4">Be the first to join our community!</p>
            <Link
              href="/auth/signin"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <div className="glassmorphism rounded-xl p-8 inline-block">
          <h2 className="text-xl font-bold text-white mb-2">Want to be listed?</h2>
          <p className="text-secondary-white mb-4">
            Sign in to create your profile and connect with the community
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>
  )
}
