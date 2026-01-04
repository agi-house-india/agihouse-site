'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Member {
  id: string
  name: string | null
  email: string
  image: string | null
  isAdmin: boolean | null
  role: string | null
  company: string | null
  city: string | null
  isApproved: boolean | null
  isVerified: boolean | null
  createdAt: string | null
}

const roleColors: Record<string, string> = {
  founder: 'bg-purple-600/20 text-purple-400',
  investor: 'bg-green-600/20 text-green-400',
  talent: 'bg-blue-600/20 text-blue-400',
  enterprise: 'bg-orange-600/20 text-orange-400',
  community: 'bg-gray-600/20 text-gray-400',
}

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/members')
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (memberId: string, updates: { isApproved?: boolean; isVerified?: boolean }) => {
    try {
      const res = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, ...updates }),
      })

      if (res.ok) {
        setMembers(members.map(m =>
          m.id === memberId ? { ...m, ...updates } : m
        ))
      }
    } catch (error) {
      console.error('Error updating member:', error)
    }
  }

  const filteredMembers = members.filter(m => {
    if (filter === 'pending') return !m.isApproved && m.role
    if (filter === 'approved') return m.isApproved
    return true
  })

  const stats = {
    total: members.length,
    approved: members.filter(m => m.isApproved).length,
    pending: members.filter(m => !m.isApproved && m.role).length,
    noProfile: members.filter(m => !m.role).length,
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-secondary-white">Manage member approvals and directory visibility</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glassmorphism rounded-xl p-4">
          <p className="text-secondary-white text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glassmorphism rounded-xl p-4">
          <p className="text-secondary-white text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
        </div>
        <div className="glassmorphism rounded-xl p-4">
          <p className="text-secondary-white text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="glassmorphism rounded-xl p-4">
          <p className="text-secondary-white text-sm">No Profile</p>
          <p className="text-2xl font-bold text-gray-400">{stats.noProfile}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-secondary-white hover:bg-gray-700'
            }`}
          >
            {f} {f === 'pending' && stats.pending > 0 && `(${stats.pending})`}
          </button>
        ))}
      </div>

      {/* Members Table */}
      <div className="glassmorphism rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-secondary-white font-medium">Member</th>
              <th className="text-left p-4 text-secondary-white font-medium hidden sm:table-cell">Role</th>
              <th className="text-left p-4 text-secondary-white font-medium hidden md:table-cell">City</th>
              <th className="text-left p-4 text-secondary-white font-medium">Status</th>
              <th className="text-right p-4 text-secondary-white font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name || ''}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {member.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{member.name || 'No name'}</p>
                      <p className="text-secondary-white text-sm">{member.email}</p>
                      {member.company && (
                        <p className="text-secondary-white text-xs">{member.company}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  {member.role ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${roleColors[member.role] || roleColors.community}`}>
                      {member.role}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">No profile</span>
                  )}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="text-secondary-white">{member.city || '-'}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {member.isApproved ? (
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                        Approved
                      </span>
                    ) : member.role ? (
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs font-medium">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">
                        No profile
                      </span>
                    )}
                    {member.isVerified && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {member.role && (
                      <>
                        {!member.isApproved ? (
                          <button
                            onClick={() => updateMember(member.id, { isApproved: true })}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => updateMember(member.id, { isApproved: false })}
                            className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-sm font-medium hover:bg-red-600/30 transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => updateMember(member.id, { isVerified: !member.isVerified })}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            member.isVerified
                              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                              : 'bg-gray-700 text-secondary-white hover:bg-gray-600'
                          }`}
                        >
                          {member.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-secondary-white">No members found</p>
          </div>
        )}
      </div>
    </div>
  )
}
