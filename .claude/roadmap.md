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

## Phase 4: Community Features 🔄 IN PROGRESS
**Goal:** Drive engagement and network effects

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| Warm Intro System | P0 | ✅ Done | Request intros through mutual connections |
| User Dashboard | P0 | ✅ Done | Personal dashboard at `/dashboard` |
| Search & Filters | P1 | ✅ Done | Advanced search for members |
| RSVP System | P1 | ✅ Done | Event registration API |
| Email Notifications | P1 | ⏳ Pending | New events, intro requests |
| Discussion Forums | P2 | ⏳ Pending | Topic-based discussions |
| Job Board | P2 | ⏳ Pending | AI roles at member companies |

**Completed features:**
- `/dashboard` - User dashboard with intro requests, events, quick actions
- `/api/introductions` - POST to request intros
- `/api/introductions/[id]` - PATCH to accept/decline intros
- `/api/events/[slug]/rsvp` - Event RSVP system
- Member search by name, company, interests
- Member filtering by role and city

---

## Phase 5: Monetization ⏳ PENDING
**Goal:** Sustainable business model

| Revenue Stream | Description |
|----------------|-------------|
| Premium Membership | ₹10K-50K/year for full access |
| Enterprise Tier | For companies (talent, visibility) |
| Event Tickets | Paid premium events |
| Sponsorships | Partner visibility packages |
| Success Fees | % of deals closed through platform |

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
- [ ] Add admin dashboard
- [ ] Set up email transactional (Resend)
- [ ] Add Stripe for payments
- [ ] Implement full-text search
- [ ] Mobile app (React Native)
