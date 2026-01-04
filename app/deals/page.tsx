import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Deals | AGI House India',
  description: 'Track investments and success stories from the AGI House network',
}

// Mock data - will be replaced with database queries
const mockDeals = [
  {
    id: '1',
    startup: {
      name: 'HealthML',
      logo: '/planet-03.png',
      sector: 'HealthTech AI',
    },
    investor: {
      name: 'Surge Ventures',
      logo: '/planet-02.png',
    },
    amount: 5000000,
    stage: 'Series A',
    announcedAt: '2025-12-15',
    isViaNetwork: true,
  },
  {
    id: '2',
    startup: {
      name: 'NeuralAI',
      logo: '/planet-01.png',
      sector: 'Enterprise AI',
    },
    investor: {
      name: 'Peak XV',
      logo: '/planet-04.png',
    },
    amount: 2000000,
    stage: 'Seed',
    announcedAt: '2025-11-20',
    isViaNetwork: true,
  },
  {
    id: '3',
    startup: {
      name: 'AgriSense',
      logo: '/planet-04.png',
      sector: 'AgriTech AI',
    },
    investor: {
      name: 'Omnivore',
      logo: '/planet-01.png',
    },
    amount: 1500000,
    stage: 'Seed',
    announcedAt: '2025-10-05',
    isViaNetwork: true,
  },
]

const stats = [
  { label: 'Total Invested', value: '₹400Cr+' },
  { label: 'Deals Closed', value: '50+' },
  { label: 'Active Startups', value: '200+' },
  { label: 'Network Investors', value: '100+' },
]

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default function DealsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Deal Flow</h1>
        <p className="text-xl text-secondary-white max-w-2xl mx-auto">
          Investments and success stories from the AGI House network
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="glassmorphism rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-secondary-white text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Deals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Investments</h2>
        <div className="space-y-4">
          {mockDeals.map((deal) => (
            <div key={deal.id} className="glassmorphism rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image
                      src={deal.startup.logo}
                      alt={deal.startup.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{deal.startup.name}</h3>
                    <p className="text-secondary-white text-sm">{deal.startup.sector}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-secondary-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image
                      src={deal.investor.logo}
                      alt={deal.investor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{deal.investor.name}</h3>
                    <p className="text-secondary-white text-sm">Investor</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(deal.amount)}</p>
                  <p className="text-secondary-white text-sm">{deal.stage} • {formatDate(deal.announcedAt)}</p>
                </div>
              </div>

              {deal.isViaNetwork && (
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded">
                    Via AGI House Network
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="glassmorphism rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How Deal Flow Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Founders List Startups</h3>
            <p className="text-secondary-white text-sm">
              Create a profile, add your startup, and indicate if you&apos;re raising
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Request Warm Intros</h3>
            <p className="text-secondary-white text-sm">
              Find the right investors and request introductions through mutual connections
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Close & Celebrate</h3>
            <p className="text-secondary-white text-sm">
              When deals close, we track and celebrate wins across the network
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/auth/signin"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Join the Network
          </Link>
        </div>
      </section>
    </div>
  )
}
