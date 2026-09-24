import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { getCourses } from '@/features/courses/queries'
import { CourseList } from '@/features/courses/components/CourseList'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Full Curriculum',
  description: `Explore the complete 13-unit curriculum offered at ${SITE_NAME}. Structured learning across foundational principles to advanced execution.`,
}

export default async function CurriculumPage() {
  const courses = await getCourses('curriculum')

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Academic Syllabus</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Curriculum Units
          </h1>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Our comprehensive curriculum is organized into distinct, progressive units designed
            to foster rigorous mastery. Each unit builds systematically on the preceding ones.
          </p>
        </div>

        {/* Units Counter / Filter Status */}
        <div className="mt-12 flex items-center justify-between border-b border-gray-200 pb-4">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-gray-900">{courses.length}</span> published units
          </p>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Sequential Progression
          </span>
        </div>

        {/* Course Grid */}
        <div className="mt-8">
          <CourseList courses={courses} />
        </div>
      </div>
    </div>
  )
}
