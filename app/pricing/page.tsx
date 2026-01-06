import { getSession } from '@/lib/auth-server'
import { PLANS } from '@/lib/stripe'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import PricingCard from './PricingCard'

export default async function PricingPage() {
  const session = await getSession()

  let currentPlan = 'free'
  if (session?.user?.id) {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)

    if (sub[0]?.status === 'active') {
      currentPlan = sub[0].plan || 'free'
    }
  }

  return (
    <main className="min-h-screen bg-primary-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Membership Plans
          </h1>
          <p className="text-xl text-secondary-white max-w-2xl mx-auto">
            Join India's premier AI community. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <PricingCard
            plan="free"
            name={PLANS.free.name}
            description={PLANS.free.description}
            price={PLANS.free.price}
            currency={PLANS.free.currency}
            interval={PLANS.free.interval}
            features={PLANS.free.features}
            isCurrentPlan={currentPlan === 'free'}
            isLoggedIn={!!session?.user}
          />

          <PricingCard
            plan="premium"
            name={PLANS.premium.name}
            description={PLANS.premium.description}
            price={PLANS.premium.price}
            currency={PLANS.premium.currency}
            interval={PLANS.premium.interval}
            features={PLANS.premium.features}
            isCurrentPlan={currentPlan === 'premium'}
            isLoggedIn={!!session?.user}
            isPopular
          />

          <PricingCard
            plan="enterprise"
            name={PLANS.enterprise.name}
            description={PLANS.enterprise.description}
            price={PLANS.enterprise.price}
            currency={PLANS.enterprise.currency}
            interval={PLANS.enterprise.interval}
            features={PLANS.enterprise.features}
            isCurrentPlan={currentPlan === 'enterprise'}
            isLoggedIn={!!session?.user}
          />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-secondary-white">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-secondary-white">
                We accept all major credit cards, debit cards, and UPI through our secure payment partner Stripe.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-secondary-white">
                The Free plan gives you access to core features. Upgrade to Premium when you're ready to unlock introductions and advanced features.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer annual billing?
              </h3>
              <p className="text-secondary-white">
                Yes! Annual plans are coming soon with 2 months free. Contact us for enterprise annual pricing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!session?.user && (
          <div className="text-center mt-16">
            <p className="text-secondary-white mb-4">
              Ready to join India's AI community?
            </p>
            <Link
              href="/auth/signin"
              className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
