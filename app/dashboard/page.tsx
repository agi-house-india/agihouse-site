import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, users, introductions, events, eventRsvps } from '@/lib/db/schema'
import { eq, or, and, gte, desc } from 'drizzle-orm'
import IntroRequestCard from './IntroRequestCard'

export const metadata = {
  title: 'Dashboard | AGI House India',
  description: 'Your personal AGI House India dashboard',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const userId = session.user.id

  // Get user and profile
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  })

  if (!profile) {
    redirect('/onboarding')
  }

  // Get intro requests (received)
  const receivedIntros = await db
    .select({
      id: introductions.id,
      message: introductions.message,
      status: introductions.status,
      createdAt: introductions.createdAt,
      requesterId: introductions.requesterId,
      requesterName: users.name,
      requesterImage: users.image,
      requesterTitle: profiles.title,
      requesterCompany: profiles.company,
    })
    .from(introductions)
    .innerJoin(users, eq(introductions.requesterId, users.id))
    .leftJoin(profiles, eq(introductions.requesterId, profiles.id))
    .where(eq(introductions.targetId, userId))
    .orderBy(desc(introductions.createdAt))
    .limit(5)

  // Get intro requests (sent)
  const sentIntros = await db
    .select({
      id: introductions.id,
      message: introductions.message,
      status: introductions.status,
      createdAt: introductions.createdAt,
      targetId: introductions.targetId,
      targetName: users.name,
      targetImage: users.image,
      targetTitle: profiles.title,
      targetCompany: profiles.company,
    })
    .from(introductions)
    .innerJoin(users, eq(introductions.targetId, users.id))
    .leftJoin(profiles, eq(introductions.targetId, profiles.id))
    .where(eq(introductions.requesterId, userId))
    .orderBy(desc(introductions.createdAt))
    .limit(5)

  // Get upcoming events
  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(and(eq(events.isPublished, true), gte(events.eventDate, today)))
    .orderBy(events.eventDate)
    .limit(3)

  // Get user's RSVPs
  const userRsvps = await db
    .select({ eventId: eventRsvps.eventId })
    .from(eventRsvps)
    .where(eq(eventRsvps.userId, userId))

  const rsvpEventIds = new Set(userRsvps.map((r) => r.eventId))

  const pendingReceivedCount = receivedIntros.filter((i) => i.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="glassmorphism rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || ''}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">
                  {user?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-secondary-white mt-1">
              {profile.title}{profile.title && profile.company && ' at '}{profile.company}
            </p>
            {!profile.isApproved && (
              <div className="mt-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg inline-block">
                <p className="text-yellow-400 text-sm">
                  Your profile is pending approval. You'll be visible in the directory once approved.
                </p>
              </div>
            )}
          </div>
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Intro Requests */}
        <div className="lg:col-span-2 space-y-8">
          {/* Received Intro Requests */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Intro Requests
                {pendingReceivedCount > 0 && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-sm rounded-full">
                    {pendingReceivedCount} new
                  </span>
                )}
              </h2>
            </div>

            {receivedIntros.length > 0 ? (
              <div className="space-y-4">
                {receivedIntros.map((intro) => (
                  <IntroRequestCard
                    key={intro.id}
                    intro={{
                      id: intro.id,
                      message: intro.message,
                      status: intro.status!,
                      createdAt: intro.createdAt,
                      personId: intro.requesterId,
                      personName: intro.requesterName,
                      personImage: intro.requesterImage,
                      personTitle: intro.requesterTitle,
                      personCompany: intro.requesterCompany,
                    }}
                    type="received"
                  />
                ))}
              </div>
            ) : (
              <p className="text-secondary-white text-center py-8">
                No intro requests yet. As you connect with more members, requests will appear here.
              </p>
            )}
          </div>

          {/* Sent Intro Requests */}
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Sent Requests</h2>
            {sentIntros.length > 0 ? (
              <div className="space-y-4">
                {sentIntros.map((intro) => (
                  <IntroRequestCard
                    key={intro.id}
                    intro={{
                      id: intro.id,
                      message: intro.message,
                      status: intro.status!,
                      createdAt: intro.createdAt,
                      personId: intro.targetId,
                      personName: intro.targetName,
                      personImage: intro.targetImage,
                      personTitle: intro.targetTitle,
                      personCompany: intro.targetCompany,
                    }}
                    type="sent"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-secondary-white mb-4">
                  You haven't sent any intro requests yet.
                </p>
                <Link
                  href="/members"
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Browse members to connect &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Events & Quick Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/members"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Browse Members</p>
                  <p className="text-secondary-white text-sm">Find people to connect with</p>
                </div>
              </Link>
              <Link
                href="/startups"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Explore Startups</p>
                  <p className="text-secondary-white text-sm">Discover AI companies</p>
                </div>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">View Profile</p>
                  <p className="text-secondary-white text-sm">See how others see you</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              <Link href="/events" className="text-purple-400 text-sm hover:text-purple-300">
                View all
              </Link>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center bg-purple-600/20 rounded-lg p-2 min-w-[50px]">
                        <p className="text-purple-400 text-xs uppercase">
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                        <p className="text-white text-xl font-bold">
                          {new Date(event.eventDate).getDate()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{event.title}</p>
                        <p className="text-secondary-white text-sm">{event.city || 'Virtual'}</p>
                        {rsvpEventIds.has(event.id) && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                            Registered
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-secondary-white text-center py-4">
                No upcoming events. Check back soon!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
