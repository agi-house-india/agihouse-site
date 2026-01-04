import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import { accounts, sessions, users, verificationTokens } from './db/schema'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn() {
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/onboarding',
  },
  session: {
    strategy: 'database',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
