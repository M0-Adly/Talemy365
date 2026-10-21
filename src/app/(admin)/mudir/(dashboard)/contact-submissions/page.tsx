import type { Metadata } from 'next'
import { getSubmissions } from '@/features/contact/queries'
import { SubmissionsManager } from '@/features/admin/components/SubmissionsManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'رسائل واستفسارات الزوار',
}

export default async function ContactSubmissionsPage() {
  const submissions = await getSubmissions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#4C1D95] sm:text-3xl">
          الرسائل والاستفسارات الواردة
        </h1>
        <p className="mt-1 text-xs text-[#6B5B95]">
          الرسائل والطلبات المرسلة من زوار الموقع عبر نموذج التواصل.
        </p>
      </div>

      <SubmissionsManager initialSubmissions={submissions} />
    </div>
  )
}
