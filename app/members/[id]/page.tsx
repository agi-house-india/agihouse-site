import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/db'
import { profiles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import RequestIntroButton from './RequestIntroButton'

const roleLabels: Record<string, string> = {
  founder: 'Founder',
  investor: 'Investor',
  talent: 'Talent',
  enterprise: 'Enterprise',
  community: 'Community',
}

const roleColors: Record<string, string> = {
  founder: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
  investor: 'bg-green-600/20 text-green-400 border-green-500/30',
  talent: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  enterprise: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  community: 'bg-gray-600/20 text-gray-400 border-gray-500/30',
}

async function getMember(id: string) {
  const memberData = await db
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
      linkedinUrl: profiles.linkedinUrl,
      twitterUrl: profiles.twitterUrl,
      websiteUrl: profiles.websiteUrl,
      isVerified: profiles.isVerified,
      interests: profiles.interests,
      lookingFor: profiles.lookingFor,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.id))
    .where(eq(users.id, id))

  return memberData[0] || null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getMember(id)

  if (!member) {
    return { title: 'Member Not Found | AGI House India' }
  }

  return {
    title: `${member.name} | AGI House India`,
    description: member.bio || `${member.name} - ${member.title} at ${member.company}`,
  }
}

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getMember(id)
  const session = await auth()

  if (!member) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === member.id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-secondary-white hover:text-white mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Directory
      </Link>

      <div className="glassmorphism rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-700">
          <div className="relative">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name || ''}
                width={96}
                height={96}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {member.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            {member.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-white">{member.name}</h1>
              {member.role && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${roleColors[member.role] || roleColors.community}`}>
                  {roleLabels[member.role] || member.role}
                </span>
              )}
            </div>
            {(member.title || member.company) && (
              <p className="text-secondary-white text-lg mt-1">
                {member.title}{member.title && member.company && ' at '}{member.company}
              </p>
            )}
            {member.city && (
              <p className="text-secondary-white flex items-center gap-1 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {member.city}
              </p>
            )}
          </div>
          {isOwnProfile ? (
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Link>
          ) : session?.user ? (
            <RequestIntroButton memberId={member.id} memberName={member.name || 'this member'} />
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Sign in to Connect
            </Link>
          )}
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-2">About</h2>
            <p className="text-secondary-white">{member.bio}</p>
          </div>
        )}

        {/* Interests */}
        {member.interests && member.interests.length > 0 && (
          <div className="py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm text-secondary-white"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Looking For */}
        {member.lookingFor && member.lookingFor.length > 0 && (
          <div className="py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {member.lookingFor.map((item: string) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="pt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Connect</h2>
          <div className="flex flex-wrap gap-3">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0077B5]/20 border border-[#0077B5]/30 rounded-lg text-[#0077B5] hover:bg-[#0077B5]/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {member.twitterUrl && (
              <a
                href={member.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-secondary-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
            )}
            {member.websiteUrl && (
              <a
                href={member.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-secondary-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
