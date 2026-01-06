import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard | AGI House India',
  description: 'Manage members and content',
}

export default async function AdminPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (!dbUser?.isAdmin) {
    redirect('/')
  }

  return <AdminDashboard />
}
