# AGI House India: Strategic Vision & Product Roadmap

## The Core Insight (Applying Paul Graham's Wisdom)

### What We Have
- **20,000+ members** across India's AI ecosystem
- **₹400 Crore+ invested** through the network
- **100+ events** creating real connections
- **9 city chapters** (Bangalore, Delhi, Bombay, Pune, Hyderabad, etc.)
- **25+ partners** including top AI companies

### The Problem We're Solving

**"Live in the future, then build what's missing"** - PG

India's AI ecosystem is fragmented:
- Founders can't find the right investors
- Investors can't find quality deal flow
- Talent is invisible to startups that need them
- Knowledge is trapped in WhatsApp groups
- Relationships are untracked, value is uncaptured

### Why This Matters (The Schlep Test)

Everyone stops at Discord/WhatsApp/LinkedIn. Building a real platform is hard:
- Tracking relationships and introductions
- Measuring value created
- Creating serendipitous connections at scale
- Owning the data vs renting it from platforms

**This is exactly where the opportunity lies.**

### The Bus Ticket Theory Check

Would you work on India's AI ecosystem obsessively, even without external rewards?

If the answer is yes, this is the right thing to build.

---

## Strategic Positioning

### What AGI House India Should Become

**Not** a generic community platform.
**Not** a newsletter.
**Not** just events.

**A deal flow machine for India's AI ecosystem.**

Every:
- Investment should flow through the network
- Key hire should be discoverable
- Startup should be visible and connected
- Insight should compound for members

### The Depth Over Breadth Principle

Focus on **AI founders raising their first $1M-$10M** (acute need) rather than "everyone in tech" (mild need for many).

Secondary focus:
- AI investors looking for quality deal flow
- Senior AI talent seeking their next role
- Enterprises needing AI solutions

---

## Product Roadmap

### Phase 0: Foundation (Current Sprint)
**Goal: Fix technical debt, prepare for scale**

| Task | Status | Impact |
|------|--------|--------|
| Upgrade Next.js to 16+ | ✅ Done | Security |
| Fix TypeScript issues | In Progress | Code quality |
| Add proper metadata/SEO | In Progress | Discovery |
| Set up testing infrastructure | Pending | Reliability |
| Upgrade TypeScript to 5.x | Pending | DX |

### Phase 1: Own Your Content
**Goal: Stop renting, start owning**

| Feature | Description | Replaces |
|---------|-------------|----------|
| **Blog System** | MDX-powered insights, founder stories | External blogs |
| **Events Platform** | Native events with RSVP, waitlists | lu.ma |
| **Speaker Directory** | Profiles of AI leaders | Scattered info |
| **Resource Library** | Curated AI tools, papers, playbooks | Link sharing |

**PG Principle Applied:** "Do things that don't scale" - Manually curate content, personally onboard writers, hand-pick featured stories.

### Phase 2: Member Identity
**Goal: Know your members, let them find each other**

| Feature | Description |
|---------|-------------|
| **Authentication** | NextAuth with Google/LinkedIn |
| **Member Profiles** | Role, company, interests, city, stage |
| **Member Directory** | Search by city, role, interests |
| **Application Flow** | Curated membership, vetting |

**PG Principle Applied:** "Depth over breadth" - Start with founders only. Make membership valuable by being selective.

### Phase 3: Deal Flow Engine
**Goal: Make investments happen through the network**

| Feature | Description |
|---------|-------------|
| **Startup Profiles** | Pitch, team, metrics, stage |
| **Investor Profiles** | Thesis, check size, portfolio |
| **Warm Intro System** | Request intros through mutual connections |
| **Deal Tracking** | Track investments made through network |
| **Success Stories** | Celebrate wins publicly |

**PG Principle Applied:** "Superlinear returns" - Every deal made through the network makes the network more valuable. Track and celebrate this.

### Phase 4: Talent Marketplace
**Goal: Help AI startups hire, help talent get discovered**

| Feature | Description |
|---------|-------------|
| **Talent Profiles** | Skills, experience, availability |
| **Job Board** | Roles at member companies only |
| **Referral System** | Members refer talent, get credit |
| **Hiring Success** | Track placements |

**PG Principle Applied:** "Growth as compass" - Measure weekly: intros made, hires completed, investments closed.

### Phase 5: Knowledge Compound
**Goal: Insights that compound, not disappear in chat**

| Feature | Description |
|---------|-------------|
| **Founder Playbooks** | How-tos from successful founders |
| **Investor Insights** | What investors are looking for |
| **Technical Deep Dives** | AI/ML tutorials from practitioners |
| **Event Recordings** | Searchable archive |
| **Discussion Threads** | Persistent, searchable Q&A |

### Phase 6: Revenue & Scale
**Goal: Sustainable business model**

| Stream | Description |
|--------|-------------|
| **Premium Membership** | ₹10K-50K/year for full access |
| **Enterprise Tier** | For companies (talent, visibility, events) |
| **Event Tickets** | Paid premium events |
| **Sponsorships** | Partner visibility packages |
| **Carry/Success Fees** | % of deals closed through platform |

---

## Technical Architecture

### Current Stack
```
Next.js 16 (App Router)
React 18
Tailwind CSS
Framer Motion
PostHog Analytics
Cloudinary (Images)
```

### Target Stack (Phase 1-3)
```
Next.js 16+ (App Router)
├── Authentication: NextAuth.js
├── Database: Supabase (Postgres + Realtime)
├── CMS: MDX + Contentlayer (or Payload CMS)
├── Email: Resend
├── Payments: Stripe
├── Search: Meilisearch
├── Analytics: PostHog + custom events
└── File Storage: Cloudinary + Supabase Storage
```

### Key Metrics to Track

**Week-over-week growth (PG's compass):**
- New member applications
- Member profile completions
- Intros requested/made
- Events RSVPs
- Content published/consumed
- Deals in pipeline
- Investments closed

---

## Implementation Principles

### From Paul Graham

1. **"Do things that don't scale"**
   - Manually vet every member initially
   - Personally make first 100 intros
   - Hand-write first 10 startup profiles

2. **"Launch early, iterate relentlessly"**
   - Ship Phase 1 features individually
   - Get to real users immediately
   - Let usage guide priorities

3. **"Depth over breadth"**
   - Focus on Bangalore + Mumbai first
   - Focus on Series A founders first
   - Nail the core use case before expanding

4. **"Mean people fail"**
   - Build culture into the product
   - Celebrate member wins publicly
   - Make helpfulness visible

5. **"Superlinear returns"**
   - Track network effects metrics
   - Make value creation visible
   - Every deal strengthens the network

---

## Next Steps (This Session)

1. ✅ Upgrade Next.js (security)
2. ✅ Fix build issues
3. 🔄 Set up proper TypeScript
4. 📝 Create database schema design
5. 📝 Implement blog/MDX system
6. 📝 Build events platform foundation
7. 📝 Add authentication

---

## Success Metrics (12-Month Vision)

| Metric | Current | Target |
|--------|---------|--------|
| Active Members | ~20K (passive) | 5K active |
| Monthly Events | ~10 | 30+ |
| Deals Closed via Network | Unknown | 50+ tracked |
| Hires via Network | Unknown | 100+ tracked |
| Premium Members | 0 | 500+ |
| Monthly Content Pieces | 0 | 20+ |

---

*"The best founders are relentlessly resourceful."* - Paul Graham

This roadmap is a living document. Update it as you learn from users.
