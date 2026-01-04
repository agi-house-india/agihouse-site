import Link from 'next/link'
import Image from 'next/image'
import { getUpcomingEvents, getPastEvents } from '@/lib/mdx'
import { format } from 'date-fns'

export const metadata = {
  title: 'Events | AGI House India',
  description: 'Join AGI House India events - where AI founders and investors connect',
}

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents(6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Events</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Join us at meetups, workshops, and conferences across India. Connect with AI founders, investors, and builders.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <div className="glassmorphism rounded-xl p-8 text-center">
            <p className="text-secondary-white text-lg mb-4">
              No upcoming events scheduled yet.
            </p>
            <p className="text-secondary-white">
              Join our WhatsApp groups to get notified about new events.
            </p>
            <Link
              href="/join"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Join Community
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Link key={event.slug} href={`/events/${event.slug}`} className="group">
                <article className="glassmorphism rounded-xl overflow-hidden hover:scale-[1.02] transition-transform h-full">
                  {event.frontmatter.coverImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.frontmatter.coverImage}
                        alt={event.frontmatter.title}
                        fill
                        className="object-cover"
                      />
                      {event.frontmatter.featured && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
                      <time dateTime={event.frontmatter.date}>
                        {format(new Date(event.frontmatter.date), 'EEE, MMM d')}
                      </time>
                      {event.frontmatter.time && (
                        <>
                          <span>•</span>
                          <span>{event.frontmatter.time}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {event.frontmatter.title}
                    </h3>
                    <p className="text-secondary-white text-sm mb-3 line-clamp-2">
                      {event.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-secondary-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.frontmatter.city}</span>
                      {event.frontmatter.isVirtual && (
                        <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                          Virtual
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Link key={event.slug} href={`/events/${event.slug}`} className="group">
                <article className="glassmorphism rounded-xl overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                  <div className="p-6">
                    <div className="text-sm text-secondary-white mb-2">
                      {format(new Date(event.frontmatter.date), 'MMM d, yyyy')}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {event.frontmatter.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary-white">
                      <span>{event.frontmatter.city}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-16 text-center">
        <div className="glassmorphism rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to host an event?
          </h2>
          <p className="text-secondary-white mb-6 max-w-xl mx-auto">
            We&apos;re always looking for venues and speakers. If you want to host an AGI House event in your city, let us know.
          </p>
          <a
            href="https://tally.so/r/mOg2pA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}