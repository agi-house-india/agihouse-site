import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { createCheckoutSession, PLANS, PlanType } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body as { plan: PlanType }

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const selectedPlan = PLANS[plan]
    if (!('stripePriceId' in selectedPlan) || !selectedPlan.stripePriceId) {
      return NextResponse.json(
        { error: 'Plan not available for purchase' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      priceId: selectedPlan.stripePriceId,
      successUrl: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
