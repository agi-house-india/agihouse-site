import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Startups | AGI House India',
  description: 'Discover AI startups building the future from India',
}

// Mock data - will be replaced with database queries
const mockStartups = [
  {
    id: '1',
    name: 'NeuralAI',
    tagline: 'Enterprise AI infrastructure for India',
    description: 'Building the foundational AI layer for Indian enterprises with focus on vernacular languages and local context.',
    logo: '/planet-01.png',
    stage: 'seed',
    sector: 'Enterprise AI',
    city: 'Bangalore',
    isRaising: true,
    raiseAmount: 2000000,
    fundingRaised: 500000,
    teamSize: 12,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'VoiceAI Labs',
    tagline: 'Voice AI for Indian languages',
    description: 'Building speech recognition and synthesis for 22 Indian languages with near-native accuracy.',
    logo: '/planet-02.png',
    stage: 'pre-seed',
    sector: 'Voice AI',
    city: 'Hyderabad',
    isRaising: true,
    raiseAmount: 750000,
    fundingRaised: 150000,
    teamSize: 6,
    isFeatured: false,
  },
  {
    id: '3',
    name: 'HealthML',
    tagline: 'AI diagnostics for Tier 2-3 India',
    description: 'Affordable AI-powered diagnostics for hospitals and clinics in underserved areas.',
    logo: '/planet-03.png',
    stage: 'series-a',
    sector: 'HealthTech AI',
    city: 'Mumbai',
    isRaising: false,
    raiseAmount: 0,
    fundingRaised: 5000000,
    teamSize: 35,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'AgriSense',
    tagline: 'Precision agriculture with computer vision',
    description: 'Helping farmers increase yields with drone-based crop monitoring and AI recommendations.',
    logo: '/planet-04.png',
    stage: 'seed',
    sector: 'AgriTech AI',
    city: 'Pune',
    isRaising: true,
    raiseAmount: 1500000,
    fundingRaised: 300000,
    teamSize: 8,
    isFeatured: false,
  },
]

const stageColors: Record<string, string> = {
  idea: 'bg-gray-600/20 text-gray-400',
  'pre-seed': 'bg-yellow-600/20 text-yellow-400',
  seed: 'bg-green-600/20 text-green-400',
  'series-a': 'bg-blue-600/20 text-blue-400',
  'series-b': 'bg-purple-600/20 text-purple-400',
  growth: 'bg-pink-600/20 text-pink-400',
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

export default function StartupsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Startup Directory</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Discover AI startups building the future from India
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
          All Startups
        </button>
        <button className="px-4 py-2 bg-gray-800 text-secondary-white rounded-lg text-sm font-medium hover:bg-gray-700">
          Raising Now
        </button>
        <button className="px-4 py-2 bg-gray-800 text-secondary-white rounded-lg text-sm font-medium hover:bg-gray-700">
          Featured
        </button>
        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
          <option value="">All Stages</option>
          <option value="pre-seed">Pre-Seed</option>
          <option value="seed">Seed</option>
          <option value="series-a">Series A</option>
          <option value="series-b">Series B+</option>
        </select>
        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
          <option value="">All Sectors</option>
          <option value="enterprise">Enterprise AI</option>
          <option value="health">HealthTech AI</option>
          <option value="fintech">FinTech AI</option>
          <option value="voice">Voice AI</option>
          <option value="agri">AgriTech AI</option>
        </select>
      </div>

      {/* Startup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockStartups.map((startup) => (
          <Link key={startup.id} href={`/startups/${startup.id}`} className="group">
            <div className="glassmorphism rounded-xl p-6 hover:scale-[1.01] transition-transform h-full">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                  <Image
                    src={startup.logo}
                    alt={startup.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {startup.name}
                    </h3>
                    {startup.isFeatured && (
                      <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs font-medium rounded">
                        Featured
                      </span>
                    )}
                    {startup.isRaising && (
                      <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs font-medium rounded">
                        Raising
                      </span>
                    )}
                  </div>
                  <p className="text-secondary-white">{startup.tagline}</p>
                </div>
              </div>

              <p className="mt-4 text-secondary-white text-sm line-clamp-2">
                {startup.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-white">Stage</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium capitalize ${stageColors[startup.stage]}`}>
                    {startup.stage.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-secondary-white">Sector</p>
                  <p className="text-white font-medium">{startup.sector}</p>
                </div>
                <div>
                  <p className="text-secondary-white">Raised</p>
                  <p className="text-white font-medium">{formatCurrency(startup.fundingRaised)}</p>
                </div>
                <div>
                  <p className="text-secondary-white">Team</p>
                  <p className="text-white font-medium">{startup.teamSize} people</p>
                </div>
              </div>

              {startup.isRaising && (
                <div className="mt-4 p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400 font-medium">Currently Raising</span>
                    <span className="text-white font-bold">{formatCurrency(startup.raiseAmount)}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-secondary-white flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {startup.city}
                </span>
                <span className="text-purple-400 font-medium group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA for founders */}
      <div className="mt-12 text-center">
        <div className="glassmorphism rounded-xl p-8 inline-block">
          <h2 className="text-xl font-bold text-white mb-2">List Your Startup</h2>
          <p className="text-secondary-white mb-4">
            Get discovered by investors and connect with the AGI House network
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Add Your Startup
          </Link>
        </div>
      </div>
    </div>
  )
}
