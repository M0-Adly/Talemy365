import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { getCourse } from '@/features/courses/queries'
import { ContentManager } from '@/features/admin/components/ContentManager'
import { ADMIN_PATH } from '@/lib/constants'

export const dynamic = 'force-dynamic'

interface CourseContentsPageProps {
  params: Promise<{
    courseId: string
  }>
}

export async function generateMetadata({
  params,
}: CourseContentsPageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return {
    title: course ? `Topics: ${course.title}` : 'Manage Topics',
  }
}

export default async function CourseContentsPage({
  params,
}: CourseContentsPageProps) {
  const { courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  const contents = course.course_contents || []

  return (
    <div className="space-y-6">
      {/* Header with back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`${ADMIN_PATH}/courses`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            aria-label="Back to courses list"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                {course.category}
              </span>
              {course.duration && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{course.duration}</span>
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {course.title}
            </h1>
            <p className="text-sm text-gray-500">
              Manage syllabus outline, lecture points, and sequencing.
            </p>
          </div>
        </div>

        <Link
          href={`${ADMIN_PATH}/courses/${course.id}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <span>Edit Course Info</span>
        </Link>
      </div>

      <ContentManager courseId={course.id} initialContents={contents} />
    </div>
  )
}
