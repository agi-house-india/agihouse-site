import { getSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewThreadForm from './NewThreadForm'

export default async function NewThreadPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/forum/new')
  }

  return (
    <main className="min-h-screen bg-primary-black pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/forum"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            &larr; Back to Forum
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Start a Discussion</h1>
        <p className="text-secondary-white mb-8">
          Share your questions, insights, or ideas with the community
        </p>

        <NewThreadForm />
      </div>
    </main>
  )
}
