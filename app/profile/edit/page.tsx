'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import Image from 'next/image'

const roles = [
  { id: 'founder', label: 'Founder', description: 'Building an AI company' },
  { id: 'investor', label: 'Investor', description: 'Investing in AI startups' },
  { id: 'talent', label: 'Talent', description: 'Working in AI/ML' },
  { id: 'enterprise', label: 'Enterprise', description: 'AI adoption at scale' },
  { id: 'community', label: 'Community', description: 'Learning and networking' },
]

const cities = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Gurgaon',
  'Noida',
  'Other',
]

const interestOptions = [
  'Large Language Models',
  'Computer Vision',
  'MLOps',
  'AI Infrastructure',
  'AI Applications',
  'Robotics',
  'Healthcare AI',
  'Fintech AI',
  'Generative AI',
  'AI Ethics',
]

const lookingForOptions = [
  'Co-founder',
  'Investment',
  'Technical talent',
  'Mentorship',
  'Partnerships',
  'Job opportunities',
  'Learning & networking',
]

export default function EditProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    title: '',
    city: '',
    bio: '',
    linkedinUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    interests: [] as string[],
    lookingFor: [] as string[],
  })

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/signin')
      return
    }

    if (!isPending && session) {
      // Fetch existing profile
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setFormData({
              role: data.profile.role || '',
              company: data.profile.company || '',
              title: data.profile.title || '',
              city: data.profile.city || '',
              bio: data.profile.bio || '',
              linkedinUrl: data.profile.linkedinUrl || '',
              twitterUrl: data.profile.twitterUrl || '',
              websiteUrl: data.profile.websiteUrl || '',
              interests: data.profile.interests || [],
              lookingFor: data.profile.lookingFor || [],
            })
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching profile:', err)
          setLoading(false)
        })
    }
  }, [isPending, session, router])

  const toggleArrayItem = (arr: string[], item: string) => {
    if (arr.includes(item)) {
      return arr.filter((i) => i !== item)
    }
    return [...arr, item]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/profile')
      } else {
        console.error('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glassmorphism rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || ''}
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <p className="text-secondary-white">{session.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role */}
          <div>
            <label className="block text-white font-medium mb-3">Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.role === role.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <p className="text-white font-medium text-sm">{role.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Work Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Where do you work?"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Your role"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-white font-medium mb-2">City</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-white font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Social Links</h3>
            <div>
              <label className="block text-secondary-white text-sm mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-secondary-white text-sm mb-1">Twitter</label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-secondary-white text-sm mb-1">Website</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-white font-medium mb-3">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interests: toggleArrayItem(formData.interests, interest),
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-secondary-white hover:bg-gray-600'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div>
            <label className="block text-white font-medium mb-3">Looking For</label>
            <div className="flex flex-wrap gap-2">
              {lookingForOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      lookingFor: toggleArrayItem(formData.lookingFor, option),
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.lookingFor.includes(option)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-secondary-white hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
