import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Members | AGI House India',
  description: 'Connect with AI founders, investors, and builders across India',
}

// Mock data - will be replaced with database queries
const mockMembers = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'founder',
    title: 'CEO & Co-founder',
    company: 'NeuralAI',
    city: 'Bangalore',
    bio: 'Building AI infrastructure for Indian enterprises. Previously at Google.',
    avatar: '/planet-01.png',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    role: 'investor',
    title: 'Partner',
    company: 'Surge Ventures',
    city: 'Mumbai',
    bio: 'Investing in early-stage AI/ML startups. 15+ investments.',
    avatar: '/planet-02.png',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Ananya Krishnan',
    role: 'talent',
    title: 'ML Engineer',
    company: 'OpenAI',
    city: 'Delhi',
    bio: 'Working on large language models. Open to advisory roles.',
    avatar: '/planet-03.png',
    isVerified: false,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    role: 'founder',
    title: 'Founder',
    company: 'VoiceAI Labs',
    city: 'Hyderabad',
    bio: 'Building voice AI for Indian languages. Raising Seed.',
    avatar: '/planet-04.png',
    isVerified: true,
  },
]

const roleColors: Record<string, string> = {
  founder: 'bg-purple-600/20 text-purple-400',
  investor: 'bg-green-600/20 text-green-400',
  talent: 'bg-blue-600/20 text-blue-400',
  enterprise: 'bg-orange-600/20 text-orange-400',
  community: 'bg-gray-600/20 text-gray-400',
}

const cities = ['All', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai']
const roles = ['All', 'Founder', 'Investor', 'Talent', 'Enterprise']

export default function MembersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Member Directory</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Connect with AI founders, investors, and builders across India
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex gap-2">
          {roles.map((role) => (
            <button
              key={role}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === 'All'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-secondary-white hover:bg-gray-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMembers.map((member) => (
          <Link key={member.id} href={`/members/${member.id}`} className="group">
            <div className="glassmorphism rounded-xl p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
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

              <p className="mt-4 text-secondary-white text-sm line-clamp-2">
                {member.bio}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${roleColors[member.role]}`}>
                  {member.role}
                </span>
                <span className="text-secondary-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {member.city}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

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
