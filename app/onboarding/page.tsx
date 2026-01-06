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

const interests = [
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

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    title: '',
    city: '',
    bio: '',
    linkedinUrl: '',
    twitterUrl: '',
    interests: [] as string[],
    lookingFor: [] as string[],
  })

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/signin')
    }
  }, [isPending, session, router])

  const toggleArrayItem = (arr: string[], item: string) => {
    if (arr.includes(item)) {
      return arr.filter((i) => i !== item)
    }
    return [...arr, item]
  }

  const handleSubmit = async () => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  if (isPending) {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full glassmorphism p-8 rounded-2xl">
        {/* User info header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || ''}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-white font-medium">{session.user?.name}</p>
            <p className="text-secondary-white text-sm">{session.user?.email}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
            <span className="text-secondary-white">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">
                What best describes you?
              </label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      formData.role === role.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <p className="text-white font-medium">{role.label}</p>
                    <p className="text-secondary-white text-sm">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.role}
              className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
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
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-600 text-white rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-white text-gray-900 rounded-lg font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Twitter URL (optional)</label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-600 text-white rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-white text-gray-900 rounded-lg font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">
                What are you interested in? (Select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
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
            <div>
              <label className="block text-white font-medium mb-3">
                What are you looking for? (Select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {lookingForOptions.map((option) => (
                  <button
                    key={option}
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
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 border border-gray-600 text-white rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
