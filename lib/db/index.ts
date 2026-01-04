import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// For query purposes - limit connections to prevent memory issues
const queryClient = postgres(connectionString, {
  max: 3,  // Max 3 connections in pool
  idle_timeout: 20,  // Close idle connections after 20s
  connect_timeout: 10,  // 10s connection timeout
})
export const db = drizzle(queryClient, { schema })

// For migrations (separate connection with max 1)
export function getMigrationClient() {
  const migrationClient = postgres(connectionString, { max: 1 })
  return drizzle(migrationClient, { schema })
}

export * from './schema'
