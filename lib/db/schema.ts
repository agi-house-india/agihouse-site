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
export const forumCategoryEnum = pgEnum('forum_category', [
  'general',
  'introductions',
  'fundraising',
  'hiring',
  'product',
  'technical',
  'events',
  'resources',
])
export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'premium',
  'enterprise',
])
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'trialing',
  'incomplete',
])

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  // Custom fields
  isAdmin: boolean('is_admin').default(false),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: 'date' }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'date' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Legacy aliases for backward compatibility during migration
export const users = user
export const accounts = account
export const sessions = session
export const verificationTokens = verification

// Application tables
export const profiles = pgTable('profiles', {
  id: text('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
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
  founderId: text('founder_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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
  organizerId: text('organizer_id').references(() => user.id),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: rsvpStatusEnum('status').default('registered'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const introductions = pgTable('introductions', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: text('requester_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  targetId: text('target_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  connectorId: text('connector_id').references(() => user.id),
  status: introStatusEnum('status').default('pending'),
  message: text('message'),
  outcome: text('outcome'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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
  investorId: text('investor_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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
  postedById: text('posted_by_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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

// Subscription tables
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  plan: subscriptionPlanEnum('plan').default('free'),
  status: subscriptionStatusEnum('status').default('active'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Forum tables
export const forumThreads = pgTable('forum_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  category: forumCategoryEnum('category').default('general'),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  viewCount: integer('view_count').default(0),
  replyCount: integer('reply_count').default(0),
  lastReplyAt: timestamp('last_reply_at'),
  lastReplyById: text('last_reply_by_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const forumReplies = pgTable('forum_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => forumThreads.id, { onDelete: 'cascade' }),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentId: uuid('parent_id'),
  isEdited: boolean('is_edited').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const forumLikes = pgTable(
  'forum_likes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    threadId: uuid('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
    replyId: uuid('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.threadId, table.replyId] })]
)

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [user.id],
    references: [profiles.id],
  }),
  accounts: many(account),
  sessions: many(session),
  startups: many(startups),
  events: many(events),
  rsvps: many(eventRsvps),
  blogPosts: many(blogPosts),
  dealsAsInvestor: many(deals),
  subscription: one(subscriptions, {
    fields: [user.id],
    references: [subscriptions.userId],
  }),
}))

export const startupsRelations = relations(startups, ({ one, many }) => ({
  founder: one(user, {
    fields: [startups.founderId],
    references: [user.id],
  }),
  deals: many(deals),
  jobs: many(jobs),
}))

export const jobsRelations = relations(jobs, ({ one }) => ({
  startup: one(startups, {
    fields: [jobs.startupId],
    references: [startups.id],
  }),
  postedBy: one(user, {
    fields: [jobs.postedById],
    references: [user.id],
  }),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(user, {
    fields: [events.organizerId],
    references: [user.id],
  }),
  rsvps: many(eventRsvps),
}))

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(user, {
    fields: [blogPosts.authorId],
    references: [user.id],
  }),
}))

export const dealsRelations = relations(deals, ({ one }) => ({
  startup: one(startups, {
    fields: [deals.startupId],
    references: [startups.id],
  }),
  investor: one(user, {
    fields: [deals.investorId],
    references: [user.id],
  }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
}))

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  author: one(user, {
    fields: [forumThreads.authorId],
    references: [user.id],
  }),
  lastReplyBy: one(user, {
    fields: [forumThreads.lastReplyById],
    references: [user.id],
  }),
  replies: many(forumReplies),
  likes: many(forumLikes),
}))

export const forumRepliesRelations = relations(forumReplies, ({ one, many }) => ({
  thread: one(forumThreads, {
    fields: [forumReplies.threadId],
    references: [forumThreads.id],
  }),
  author: one(user, {
    fields: [forumReplies.authorId],
    references: [user.id],
  }),
  parent: one(forumReplies, {
    fields: [forumReplies.parentId],
    references: [forumReplies.id],
  }),
  likes: many(forumLikes),
}))
