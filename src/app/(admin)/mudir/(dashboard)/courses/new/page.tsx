import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CourseForm } from '@/features/courses/components/CourseForm'
import { ADMIN_PATH } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Create New Course Unit',
}

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`${ADMIN_PATH}/courses`}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          aria-label="Back to courses list"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create New Unit
          </h1>
          <p className="text-sm text-gray-500">
            Add a new course unit to the curriculum or foundation program.
          </p>
        </div>
      </div>

      <CourseForm />
    </div>
  )
}
