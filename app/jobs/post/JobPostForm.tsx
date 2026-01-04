'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  startupName: string
}

export default function JobPostForm({ startupName }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'INR',
    jobType: 'full-time',
    locationType: 'hybrid',
    city: '',
    applyUrl: '',
    applyEmail: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, skills }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to post job')
      }

      router.push('/jobs')
      router.refresh()
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

      {/* Job Title */}
      <div>
        <label className="block text-white font-medium mb-2">
          Job Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior ML Engineer"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          required
        />
      </div>

      {/* Job Type & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Location Type</label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-white font-medium mb-2">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g., Bangalore"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Salary */}
      <div>
        <label className="block text-white font-medium mb-2">Salary Range (Annual)</label>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="Min (e.g., 1500000)"
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="Max (e.g., 2500000)"
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <select
            name="salaryCurrency"
            value={formData.salaryCurrency}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-white font-medium mb-2">
          Job Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          placeholder="Describe the role, responsibilities, and what makes it exciting..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
          required
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-white font-medium mb-2">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
          placeholder="List the required qualifications, experience, and skills..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-white font-medium mb-2">Skills</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="e.g., Python, TensorFlow"
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Add
          </button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-400 flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-purple-400 hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Apply Link */}
      <div>
        <label className="block text-white font-medium mb-2">Application Link or Email</label>
        <input
          type="text"
          name="applyUrl"
          value={formData.applyUrl}
          onChange={handleChange}
          placeholder="https://... or email@company.com"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
        <p className="text-secondary-white text-sm mt-1">
          Where should candidates apply? Provide a URL or email address.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-purple-600 text-white rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Posting...' : 'Post Job'}
      </button>

      <p className="text-secondary-white text-sm text-center">
        Jobs are listed for 30 days. You can manage your listings from your dashboard.
      </p>
    </form>
  )
}
