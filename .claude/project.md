# AGI House India - Project Context

## Overview
AGI House India is a community platform for AI builders in India. The goal is to transform it from a static landing page into a full-fledged deal flow platform for India's AI ecosystem.

## Key Stats (as of Jan 2025)
- 20,000+ members across India
- ₹400 Crore+ invested through the network
- 100+ events organized
- 9 city chapters: Bangalore, Mumbai, Delhi, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Gurgaon, Noida

## Tech Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion 12.x
- **Database:** Postgres on Render (Singapore region)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth v5 with Google/LinkedIn
- **Content:** MDX for blog/events
- **Analytics:** PostHog
- **Images:** Cloudinary

## Database
- **Host:** Render Postgres
- **Name:** agihouse-db
- **Region:** Singapore (for India latency)
- **Schema:** Drizzle ORM with users, profiles, startups, events, deals, introductions

## Key Files
- `lib/db/schema.ts` - Database schema
- `lib/auth.ts` - Authentication configuration
- `lib/mdx.ts` - MDX content utilities
- `VISION.md` - Strategic product roadmap
- `drizzle.config.ts` - Database migration config

## Routes
```
/              → Home page with hero, stats, offerings
/startups      → Startup directory
/members       → Member directory
/events        → Events listing
/events/[slug] → Event details
/blog          → Blog listing
/blog/[slug]   → Blog post
/deals         → Deal flow tracking
/join          → WhatsApp community groups
/auth/signin   → Sign in with Google/LinkedIn
/onboarding    → Profile completion wizard
```

## Design Principles (Paul Graham Wisdom)
1. **Depth over breadth** - Focus on AI founders raising $1M-$10M, not everyone
2. **Do things that don't scale** - Manually vet members, curate content
3. **Superlinear returns** - Every deal makes the network more valuable
4. **Growth as compass** - Track weekly: intros, deals, members

## Current Phase: Phase 2 Complete
- ✅ Phase 0: Foundation (Next.js upgrade, TypeScript)
- ✅ Phase 1: Content Platform (Blog, Events)
- ✅ Phase 2: Member Platform (Profiles, Startups, Deals)
- 🔄 Phase 3: Deploy and go live
- ⏳ Phase 4: Community Features
- ⏳ Phase 5: Monetization

## Environment Variables Required
```
DATABASE_URL          # Render Postgres connection string
NEXTAUTH_SECRET       # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID      # From Google Cloud Console
GOOGLE_CLIENT_SECRET
LINKEDIN_CLIENT_ID    # From LinkedIn Developer Portal
LINKEDIN_CLIENT_SECRET
```

## Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (DB GUI)
```
