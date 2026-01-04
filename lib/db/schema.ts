import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  date,
  time,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'founder',
  'investor',
  'talent',
  'enterprise',
  'community',
])
export const startupStageEnum = pgEnum('startup_stage', [
  'idea',
  'pre-seed',
  'seed',
  'series-a',
  'series-b',
  'growth',
])
export const introStatusEnum = pgEnum('intro_status', [
  'pending',
  'accepted',
  'declined',
  'completed',
])
export const rsvpStatusEnum = pgEnum('rsvp_status', [
  'registered',
  'waitlist',
  'attended',
  'cancelled',
])
export const jobTypeEnum = pgEnum('job_type', [
  'full-time',
  'part-time',
  'contract',
  'internship',
])
export const jobLocationEnum = pgEnum('job_location', [
  'remote',
  'hybrid',
  'onsite',
])

// NextAuth required tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]
)

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
)

// Application tables
export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  role: userRoleEnum('role').default('community'),
  company: text('company'),
  title: text('title'),
  city: text('city'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  websiteUrl: text('website_url'),
  isVerified: boolean('is_verified').default(false),
  isPremium: boolean('is_premium').default(false),
  isApproved: boolean('is_approved').default(false),
  interests: text('interests').array().default([]),
  lookingFor: text('looking_for').array().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const startups = pgTable('startups', {
  id: uuid('id').primaryKey().defaultRandom(),
  founderId: uuid('founder_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  tagline: text('tagline'),
  description: text('description'),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  stage: startupStageEnum('stage').default('idea'),
  sector: text('sector'),
  city: text('city'),
  teamSize: integer('team_size'),
  fundingRaised: bigint('funding_raised', { mode: 'number' }).default(0),
  isRaising: boolean('is_raising').default(false),
  raiseAmount: bigint('raise_amount', { mode: 'number' }),
  pitchDeckUrl: text('pitch_deck_url'),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content'),
  coverImageUrl: text('cover_image_url'),
  eventDate: date('event_date').notNull(),
  eventTime: time('event_time'),
  location: text('location'),
  city: text('city'),
  isVirtual: boolean('is_virtual').default(false),
  virtualLink: text('virtual_link'),
  capacity: integer('capacity'),
  isFeatured: boolean('is_featured').default(false),
  isPublished: boolean('is_published').default(false),
  organizerId: uuid('organizer_id').references(() => users.id),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: rsvpStatusEnum('status').default('registered'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const introductions = pgTable('introductions', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  targetId: uuid('target_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').references(() => users.id),
  status: introStatusEnum('status').default('pending'),
  message: text('message'),
  outcome: text('outcome'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url'),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  tags: text('tags').array().default([]),
  readingTime: integer('reading_time'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id')
    .notNull()
    .references(() => startups.id, { onDelete: 'cascade' }),
  investorId: uuid('investor_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: bigint('amount', { mode: 'number' }),
  stage: text('stage'),
  announcedAt: date('announced_at'),
  isViaNetwork: boolean('is_via_network').default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  startupId: uuid('startup_id')
    .notNull()
    .references(() => startups.id, { onDelete: 'cascade' }),
  postedById: uuid('posted_by_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: text('salary_currency').default('INR'),
  jobType: jobTypeEnum('job_type').default('full-time'),
  locationType: jobLocationEnum('location_type').default('hybrid'),
  city: text('city'),
  applyUrl: text('apply_url'),
  applyEmail: text('apply_email'),
  skills: text('skills').array().default([]),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.id],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  startups: many(startups),
  events: many(events),
  rsvps: many(eventRsvps),
  blogPosts: many(blogPosts),
  dealsAsInvestor: many(deals),
}))

export const startupsRelations = relations(startups, ({ one, many }) => ({
  founder: one(users, {
    fields: [startups.founderId],
    references: [users.id],
  }),
  deals: many(deals),
  jobs: many(jobs),
}))

export const jobsRelations = relations(jobs, ({ one }) => ({
  startup: one(startups, {
    fields: [jobs.startupId],
    references: [startups.id],
  }),
  postedBy: one(users, {
    fields: [jobs.postedById],
    references: [users.id],
  }),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  rsvps: many(eventRsvps),
}))

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}))

export const dealsRelations = relations(deals, ({ one }) => ({
  startup: one(startups, {
    fields: [deals.startupId],
    references: [startups.id],
  }),
  investor: one(users, {
    fields: [deals.investorId],
    references: [users.id],
  }),
}))
