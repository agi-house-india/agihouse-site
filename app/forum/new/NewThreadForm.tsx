'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'general', label: 'General', description: 'General discussions' },
  { value: 'introductions', label: 'Introductions', description: 'Introduce yourself to the community' },
  { value: 'fundraising', label: 'Fundraising', description: 'Funding questions and advice' },
  { value: 'hiring', label: 'Hiring', description: 'Hiring and job discussions' },
  { value: 'product', label: 'Product', description: 'Product development and strategy' },
  { value: 'technical', label: 'Technical', description: 'Technical discussions and help' },
  { value: 'events', label: 'Events', description: 'Community events and meetups' },
  { value: 'resources', label: 'Resources', description: 'Share useful resources' },
]

export default function NewThreadForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create thread')
      }

      const { slug } = await res.json()
      router.push(`/forum/${slug}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-white font-medium mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label} - {cat.description}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-white font-medium mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What would you like to discuss?"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          required
          maxLength={200}
        />
        <p className="text-secondary-white text-sm mt-1">
          {formData.title.length}/200 characters
        </p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-white font-medium mb-2">
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share the details of your question or topic..."
          rows={8}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
          required
        />
      </div>

      {/* Guidelines */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Community Guidelines</h4>
        <ul className="text-secondary-white text-sm space-y-1">
          <li>Be respectful and constructive</li>
          <li>Search before posting to avoid duplicates</li>
          <li>Use appropriate categories</li>
          <li>No spam or self-promotion without value</li>
        </ul>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-purple-600 text-white rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Creating...' : 'Create Discussion'}
      </button>
    </form>
  )
}
