'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface IntroData {
  id: string
  message: string | null
  status: string
  createdAt: Date
  personId: string
  personName: string | null
  personImage: string | null
  personTitle: string | null
  personCompany: string | null
}

interface Props {
  intro: IntroData
  type: 'received' | 'sent'
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  accepted: 'bg-green-500/20 text-green-400',
  declined: 'bg-red-500/20 text-red-400',
  completed: 'bg-blue-500/20 text-blue-400',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
}

export default function IntroRequestCard({ intro, type }: Props) {
  const [status, setStatus] = useState(intro.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: 'accepted' | 'declined') => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/introductions/${intro.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error('Error updating intro status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="flex items-start gap-4">
        <Link href={`/members/${intro.personId}`} className="flex-shrink-0">
          {intro.personImage ? (
            <Image
              src={intro.personImage}
              alt={intro.personName || ''}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-lg text-white font-bold">
                {intro.personName?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/members/${intro.personId}`}
              className="text-white font-medium hover:text-purple-400 truncate"
            >
              {intro.personName}
            </Link>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <p className="text-secondary-white text-sm truncate">
            {intro.personTitle}{intro.personTitle && intro.personCompany && ' at '}{intro.personCompany}
          </p>
          {intro.message && (
            <p className="text-secondary-white text-sm mt-2 line-clamp-2">
              "{intro.message}"
            </p>
          )}
          <p className="text-gray-500 text-xs mt-2">{timeAgo(intro.createdAt)}</p>
        </div>
      </div>

      {/* Action buttons for received pending requests */}
      {type === 'received' && status === 'pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={() => handleStatusUpdate('accepted')}
            disabled={updating}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Accept'}
          </button>
          <button
            onClick={() => handleStatusUpdate('declined')}
            disabled={updating}
            className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}

      {/* Connect action for accepted requests */}
      {status === 'accepted' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Link
            href={`/members/${intro.personId}`}
            className="block text-center py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View Profile
          </Link>
        </div>
      )}
    </div>
  )
}
