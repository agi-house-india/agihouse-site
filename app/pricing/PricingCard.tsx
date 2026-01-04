'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  plan: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  features: string[]
  isCurrentPlan: boolean
  isLoggedIn: boolean
  isPopular?: boolean
}

export default function PricingCard({
  plan,
  name,
  description,
  price,
  currency,
  interval,
  features,
  isCurrentPlan,
  isLoggedIn,
  isPopular,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formatPrice = (amount: number, curr: string) => {
    if (amount === 0) return 'Free'
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    })
    return formatter.format(amount)
  }

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }

    if (plan === 'free' || isCurrentPlan) return

    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Unable to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative bg-gray-900/50 border rounded-2xl p-8 ${
        isPopular
          ? 'border-purple-500 ring-2 ring-purple-500/20'
          : 'border-gray-800'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-secondary-white text-sm">{description}</p>
      </div>

      <div className="text-center mb-8">
        <span className="text-4xl font-bold text-white">
          {formatPrice(price, currency)}
        </span>
        {price > 0 && (
          <span className="text-secondary-white">/{interval}</span>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : plan === 'free'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : isPopular
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {loading
          ? 'Loading...'
          : isCurrentPlan
          ? 'Current Plan'
          : plan === 'free'
          ? 'Get Started'
          : 'Subscribe'}
      </button>
    </div>
  )
}
