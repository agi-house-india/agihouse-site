'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const cities = ['All', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon']
const roles = ['All', 'Founder', 'Investor', 'Talent', 'Enterprise', 'Community']

export default function MemberFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRole = searchParams?.get('role') || 'All'
  const currentCity = searchParams?.get('city') || 'All'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value === 'All') {
      params.delete(key)
    } else {
      params.set(key, value.toLowerCase())
    }
    router.push(`/members?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <div className="flex gap-2 flex-wrap justify-center">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => updateFilter('role', role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentRole.toLowerCase() === role.toLowerCase()
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-secondary-white hover:bg-gray-700'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      <select
        value={currentCity}
        onChange={(e) => updateFilter('city', e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
      >
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  )
}
