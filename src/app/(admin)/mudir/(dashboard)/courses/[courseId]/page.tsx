import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ListOrdered } from 'lucide-react'
import { getCourse } from '@/features/courses/queries'
import { CourseForm } from '@/features/courses/components/CourseForm'
import { ADMIN_PATH } from '@/lib/constants'

export const dynamic = 'force-dynamic'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export async function generateMetadata({
  params,
}: EditCoursePageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)
  return {
    title: course ? `Edit: ${course.title}` : 'Edit Course',
  }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Edit Course Unit
            </h1>
            <p className="text-sm text-gray-500 truncate max-w-md">
              {course.title}
            </p>
          </div>
        </div>

        <Link
          href={`${ADMIN_PATH}/courses/${course.id}/contents`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-xs"
        >
          <ListOrdered className="h-4 w-4" />
          <span>Manage Topics ({course.course_contents?.length || 0})</span>
        </Link>
      </div>

      <CourseForm course={course} />
    </div>
  )
}
