import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type SubscriptionPlan = 'free' | 'premium' | 'enterprise'

export interface UserSubscription {
  plan: SubscriptionPlan
  status: string
  isPremium: boolean
  isEnterprise: boolean
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const sub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  if (!sub[0] || sub[0].status !== 'active') {
    return {
      plan: 'free',
      status: 'none',
      isPremium: false,
      isEnterprise: false,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  }

  const plan = sub[0].plan as SubscriptionPlan

  return {
    plan,
    status: sub[0].status || 'active',
    isPremium: plan === 'premium' || plan === 'enterprise',
    isEnterprise: plan === 'enterprise',
    currentPeriodEnd: sub[0].currentPeriodEnd,
    cancelAtPeriodEnd: sub[0].cancelAtPeriodEnd || false,
  }
}

export function canRequestIntro(subscription: UserSubscription): boolean {
  return subscription.isPremium
}

export function canPostJob(subscription: UserSubscription): boolean {
  return subscription.isPremium
}

export function isFeaturedMember(subscription: UserSubscription): boolean {
  return subscription.isPremium
}

export function hasPriorityEventAccess(subscription: UserSubscription): boolean {
  return subscription.isPremium
}

export function hasTeamAccess(subscription: UserSubscription): boolean {
  return subscription.isEnterprise
}
