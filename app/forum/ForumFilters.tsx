'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const CATEGORIES = [
  { value: 'all', label: 'All Topics' },
  { value: 'general', label: 'General' },
  { value: 'introductions', label: 'Introductions' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'product', label: 'Product' },
  { value: 'technical', label: 'Technical' },
  { value: 'events', label: 'Events' },
  { value: 'resources', label: 'Resources' },
]

interface Props {
  currentCategory?: string
  currentSearch?: string
  categoryCounts: Record<string, number>
}

export default function ForumFilters({
  currentCategory,
  currentSearch,
  categoryCounts,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/forum?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search discussions..."
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const count = cat.value === 'all' ? totalCount : (categoryCounts[cat.value] || 0)
          const isActive = (currentCategory || 'all') === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => updateParams('category', cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.label}
              <span className="ml-2 text-xs opacity-60">({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
