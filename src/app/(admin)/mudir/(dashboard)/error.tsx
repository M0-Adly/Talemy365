'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-xl font-bold text-gray-900">
        Administrative Action Error
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-600">
        An error occurred while loading this section of the admin dashboard.
      </p>

      <div className="mt-6">
        <Button onClick={() => reset()} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Retry</span>
        </Button>
      </div>
    </div>
  )
}
