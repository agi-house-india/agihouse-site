import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard | AGI House India',
  description: 'Manage members and content',
}

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user?.isAdmin) {
    redirect('/')
  }

  return <AdminDashboard />
}
