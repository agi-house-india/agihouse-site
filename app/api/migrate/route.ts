import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

// One-time migration endpoint to create Better Auth tables
// DELETE THIS FILE AFTER RUNNING ONCE
export async function GET(request: Request) {
  // Simple auth check via query param
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.BETTER_AUTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Create Better Auth tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "email_verified" boolean NOT NULL DEFAULT false,
        "image" text,
        "is_admin" boolean DEFAULT false,
        "stripe_customer_id" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `)

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY,
        "expires_at" timestamp NOT NULL,
        "token" text NOT NULL UNIQUE,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `)

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamp,
        "refresh_token_expires_at" timestamp,
        "scope" text,
        "password" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `)

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `)

    return NextResponse.json({
      success: true,
      message: 'Better Auth tables created successfully'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
