'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const cities = ['All', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon']
const roles = ['All', 'Founder', 'Investor', 'Talent', 'Enterprise', 'Community']

export default function MemberFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRole = searchParams?.get('role') || 'All'
  const currentCity = searchParams?.get('city') || 'All'
  const currentSearch = searchParams?.get('q') || ''
  const [search, setSearch] = useState(currentSearch)

  useEffect(() => {
    setSearch(currentSearch)
  }, [currentSearch])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value === 'All' || value === '') {
      params.delete(key)
    } else {
      params.set(key, key === 'role' ? value.toLowerCase() : value)
    }
    router.push(`/members?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('q', search)
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, company, or interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                updateFilter('q', '')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
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
    </div>
  )
}
