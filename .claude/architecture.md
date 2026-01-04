# AGI House India - Architecture

## Directory Structure

```
agihouse-site/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── auth/[...nextauth]/  # NextAuth API route
│   ├── auth/
│   │   └── signin/         # Sign in page
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/         # Blog post
│   ├── deals/              # Deal tracking
│   ├── events/
│   │   ├── page.tsx        # Events listing
│   │   └── [slug]/         # Event details
│   ├── join/               # WhatsApp groups
│   ├── members/            # Member directory
│   ├── onboarding/         # Profile wizard
│   ├── startups/           # Startup directory
│   ├── layout.js           # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Partners.tsx
│   ├── Communities.jsx
│   └── ui/
├── content/                # MDX content
│   ├── blog/
│   └── events/
├── lib/                    # Core utilities
│   ├── auth.ts             # NextAuth config
│   ├── db/
│   │   ├── index.ts        # Drizzle client
│   │   └── schema.ts       # Database schema
│   └── mdx.ts              # MDX utilities
├── sections/               # Homepage sections
├── styles/                 # Global CSS
├── types/                  # TypeScript types
│   └── database.ts
├── utils/                  # Utility functions
└── public/                 # Static assets
```

## Database Schema

```
┌─────────────┐     ┌─────────────┐
│   users     │────▶│  profiles   │
└─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  accounts   │     │  startups   │
└─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  sessions   │     │   deals     │
└─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│   events    │────▶│ event_rsvps │
└─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│ blog_posts  │     │introductions│
└─────────────┘     └─────────────┘
```

## Key Tables

### users (NextAuth)
- id, name, email, image, emailVerified

### profiles (extends users)
- bio, role (founder/investor/talent/enterprise/community)
- company, title, city
- linkedin_url, twitter_url
- is_verified, is_premium
- interests[], looking_for[]

### startups
- founder_id → users
- name, tagline, description
- stage (idea → growth)
- sector, city, team_size
- funding_raised, is_raising, raise_amount
- pitch_deck_url, is_featured

### events
- title, slug, description, content
- event_date, event_time, location, city
- is_virtual, virtual_link, capacity
- is_featured, is_published

### deals
- startup_id → startups
- investor_id → users
- amount, stage, announced_at
- is_via_network (tracks AGI House attribution)

### introductions
- requester_id → users
- target_id → users
- connector_id → users
- status (pending/accepted/declined/completed)
- message, outcome

## Authentication Flow

```
User clicks "Sign In"
       │
       ▼
   /auth/signin
       │
       ▼
  Google/LinkedIn OAuth
       │
       ▼
  NextAuth callback
       │
       ▼
  Create/update user in DB
       │
       ▼
  Redirect to /onboarding (new) or / (existing)
```

## Data Flow

### Blog Posts
```
content/blog/*.mdx → lib/mdx.ts → /blog pages
```

### Events
```
content/events/*.mdx → lib/mdx.ts → /events pages
(Future: database events via Drizzle)
```

### Members/Startups
```
Database → Drizzle ORM → Server Components → UI
```
