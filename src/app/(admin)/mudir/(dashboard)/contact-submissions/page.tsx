import type { Metadata } from 'next'
import { getSubmissions } from '@/features/contact/queries'
import { SubmissionsManager } from '@/features/admin/components/SubmissionsManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Inquiries & Contact Submissions',
}

export default async function ContactSubmissionsPage() {
  const submissions = await getSubmissions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Inquiries & Contact Messages
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Messages submitted by prospective students through the public contact form.
        </p>
      </div>

      <SubmissionsManager initialSubmissions={submissions} />
    </div>
  )
}
