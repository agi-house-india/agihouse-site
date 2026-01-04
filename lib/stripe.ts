import Stripe from 'stripe'

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  })
}

export const stripe = getStripeClient()

// Pricing plans configuration
export const PLANS = {
  free: {
    name: 'Free',
    description: 'Basic access to the community',
    price: 0,
    currency: 'INR',
    interval: 'month' as const,
    features: [
      'View member directory',
      'Join public events',
      'Access forum discussions',
      'View job listings',
    ],
  },
  premium: {
    name: 'Premium',
    description: 'Full access to all features',
    price: 999, // ₹999/month or ~₹10K/year
    currency: 'INR',
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Free',
      'Request warm introductions',
      'Featured profile visibility',
      'Priority event access',
      'Post job listings',
      'Direct messaging',
      'Investor matching',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For companies and teams',
    price: 4999, // ₹4,999/month or ~₹50K/year
    currency: 'INR',
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Everything in Premium',
      'Multiple team members',
      'Company profile page',
      'Talent pipeline access',
      'Sponsored content',
      'Analytics dashboard',
      'Dedicated support',
    ],
  },
}

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}
