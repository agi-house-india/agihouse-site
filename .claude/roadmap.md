# AGI House India - Product Roadmap

## Vision Statement
Transform AGI House India from a static landing page into **the deal flow machine for India's AI ecosystem**.

---

## Phase 0: Foundation ✅ COMPLETE
**Goal:** Fix technical debt, prepare for scale

| Task | Status |
|------|--------|
| Upgrade Next.js (security fix) | ✅ Done |
| Upgrade TypeScript to 5.x | ✅ Done |
| Set up path aliases | ✅ Done |
| Fix type declarations | ✅ Done |

---

## Phase 1: Content Platform ✅ COMPLETE
**Goal:** Own your content, stop renting from external platforms

| Feature | Status | Details |
|---------|--------|---------|
| MDX Blog System | ✅ Done | `/blog`, `/blog/[slug]` |
| Native Events | ✅ Done | `/events`, `/events/[slug]` |
| Content utilities | ✅ Done | `lib/mdx.ts` |

**Sample content created:**
- Blog: "Welcome to AGI House India"
- Event: "AI Founders Meetup - Bangalore"

---

## Phase 2: Member Platform ✅ COMPLETE
**Goal:** Know your members, let them find each other

| Feature | Status | Details |
|---------|--------|---------|
| Database setup | ✅ Done | Render Postgres + Drizzle ORM |
| Auth system | ✅ Done | NextAuth v5, Google/LinkedIn |
| Member directory | ✅ Done | `/members` with filters |
| Startup directory | ✅ Done | `/startups` with funding status |
| Deal tracking | ✅ Done | `/deals` with network stats |
| Onboarding flow | ✅ Done | `/onboarding` 3-step wizard |

**Database tables:**
- users, accounts, sessions (NextAuth)
- profiles (member details)
- startups (company profiles)
- events, event_rsvps
- blog_posts
- deals (investment tracking)
- introductions (warm intro system)

---

## Phase 3: Deploy & Launch ✅ COMPLETE
**Goal:** Go live on production

| Task | Status |
|------|--------|
| Push database schema | ✅ Done |
| Set up Render Web Service | ✅ Done |
| Configure environment variables | ✅ Done |
| Set up OAuth credentials | ✅ Done |
| Connect custom domain | ⏳ Pending |
| Test production build | ✅ Done |

**Production URL:** https://agihouse-india.onrender.com

---

## Phase 4: Community Features ✅ COMPLETE
**Goal:** Drive engagement and network effects

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| Warm Intro System | P0 | ✅ Done | Request intros through mutual connections |
| User Dashboard | P0 | ✅ Done | Personal dashboard at `/dashboard` |
| Search & Filters | P1 | ✅ Done | Advanced search for members |
| RSVP System | P1 | ✅ Done | Event registration API |
| Email Notifications | P1 | ✅ Done | Resend integration for approval emails |
| Job Board | P2 | ✅ Done | AI roles at member companies |
| Discussion Forums | P2 | ✅ Done | Topic-based discussions |

**Completed features:**
- `/dashboard` - User dashboard with intro requests, events, quick actions
- `/api/introductions` - POST to request intros
- `/api/introductions/[id]` - PATCH to accept/decline intros
- `/api/events/[slug]/rsvp` - Event RSVP system
- `/jobs` - Job board with search, filters, and job posting
- `/jobs/[id]` - Job detail pages
- `/jobs/post` - Job posting form for startup founders
- `/api/jobs` - Jobs API for listing and posting
- `/forum` - Discussion forum with category filtering
- `/forum/[slug]` - Thread detail pages with replies
- `/forum/new` - New discussion form
- `/api/forum` - Forum API for threads
- `/api/forum/[slug]/replies` - Replies API
- Member search by name, company, interests
- Member filtering by role and city
- Resend email integration for member approval notifications

---

## Phase 4.5: Deal Flow Engine ⏳ PENDING
**Goal:** Become the infrastructure for AI deals in India

| Feature | Priority | Description |
|---------|----------|-------------|
| Investor Directory | P0 | Angels, VCs, family offices with thesis, check size, sectors |
| AI-Powered Matching | P0 | Recommend investors↔startups, founders↔co-founders, member↔member |
| Admin Dashboard | P1 | Approve members, moderate content, view metrics, manage featured |
| Weekly Digest Email | P1 | New startups, upcoming events, deals closed, content highlights |
| Demo Day / Pitch Events | P1 | Virtual pitch sessions with investor tracking & intro facilitation |
| Due Diligence Room | P2 | Secure document sharing with access control & view tracking |

---

## Phase 5: Monetization ✅ COMPLETE
**Goal:** Sustainable business model

| Revenue Stream | Status | Description |
|----------------|--------|-------------|
| Premium Membership | ✅ Done | ₹999/month for full access |
| Enterprise Tier | ✅ Done | ₹4,999/month for teams |
| Stripe Integration | ✅ Done | Checkout, billing portal, webhooks |
| Event Tickets | ⏳ Pending | Paid premium events |
| Sponsorships | ⏳ Pending | Partner visibility packages |

**Completed features:**
- `/pricing` - Pricing page with Free, Premium, Enterprise plans
- `/api/billing/checkout` - Stripe checkout session creation
- `/api/billing/portal` - Stripe billing portal for subscription management
- `/api/webhooks/stripe` - Webhook handler for subscription events
- `/billing/success` - Success page after checkout
- `subscriptions` table for tracking user subscriptions
- Subscription helper utilities (`lib/subscription.ts`)

---

## Key Metrics to Track
- Weekly active members
- Member profile completions
- Intro requests made/accepted
- Events RSVPs
- Deals tracked via network
- Content published/consumed

---

## Technical Debt & Future Work
- [ ] Add image upload for profiles
- [ ] Implement real-time notifications
- [x] Set up email transactional (Resend) ✅
- [ ] Add Stripe for payments
- [ ] Implement full-text search
- [ ] Mobile app (React Native)

*Note: Admin dashboard moved to Phase 4.5*
