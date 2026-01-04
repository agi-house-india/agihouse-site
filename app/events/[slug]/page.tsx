import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { format } from 'date-fns'
import { getAllEvents, getEvent } from '@/lib/mdx'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const events = getAllEvents()
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) return { title: 'Event Not Found' }

  return {
    title: `${event.frontmatter.title} | AGI House India`,
    description: event.frontmatter.description,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = getEvent(slug)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.frontmatter.date)
  const isPast = eventDate < new Date()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/events"
        className="inline-flex items-center text-secondary-white hover:text-white mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      <article>
        {event.frontmatter.coverImage && (
          <div className="relative h-64 sm:h-80 w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={event.frontmatter.coverImage}
              alt={event.frontmatter.title}
              fill
              className="object-cover"
              priority
            />
            {isPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">Past Event</span>
              </div>
            )}
          </div>
        )}

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {event.frontmatter.featured && !isPast && (
              <span className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                Featured
              </span>
            )}
            {event.frontmatter.isVirtual && (
              <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">
                Virtual Event
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {event.frontmatter.title}
          </h1>

          <p className="text-xl text-secondary-white mb-6">
            {event.frontmatter.description}
          </p>

          <div className="glassmorphism rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-white font-medium">
                  {format(eventDate, 'EEEE, MMMM d, yyyy')}
                </p>
                {event.frontmatter.time && (
                  <p className="text-secondary-white text-sm">{event.frontmatter.time} IST</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-white font-medium">{event.frontmatter.location}</p>
                <p className="text-secondary-white text-sm">{event.frontmatter.city}</p>
              </div>
            </div>

            {event.frontmatter.capacity && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-white">
                  {event.frontmatter.capacity} spots
                </p>
              </div>
            )}

            {!isPast && (
              <a
                href="https://tally.so/r/mOg2pA"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors mt-4"
              >
                Register for Event
              </a>
            )}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={event.content} />
        </div>

        {event.frontmatter.tags && event.frontmatter.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {event.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800 text-secondary-white rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
