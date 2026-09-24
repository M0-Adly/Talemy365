import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Clock,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { getCourse } from '@/features/courses/queries'
import { SITE_NAME } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: course.title,
    description:
      course.description ||
      `Detailed curriculum and content breakdown for ${course.title} at ${SITE_NAME}.`,
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  const contents = course.course_contents || []

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link
            href="/curriculum"
            className="inline-flex min-h-[44px] items-center gap-1.5 font-medium text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Curriculum</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="font-semibold text-gray-900 truncate">
            {course.title}
          </span>
        </nav>

        {/* Course Header Banner */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/50 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
              {course.category}
            </span>
            {course.duration && (
              <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>{course.duration}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated {formatDate(course.updated_at)}</span>
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {course.title}
          </h1>

          {course.description && (
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              {course.description}
            </p>
          )}
        </div>

        {/* Content Breakdown Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Unit Syllabus & Topics
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Key concepts, lectures, and milestones included within this unit.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
              {contents.length} {contents.length === 1 ? 'Topic' : 'Topics'}
            </span>
          </div>

          {contents.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-800">
                Curriculum outline in progress
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                The specific content breakdown for this unit is being finalized by faculty.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {contents.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs transition-colors hover:border-blue-100 hover:bg-blue-50/20"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-gray-900 text-base sm:text-lg">
                      {item.title}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Step CTA */}
        <div className="mt-16 rounded-2xl bg-gray-900 p-8 text-white sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Interested in this unit?</h3>
            <p className="mt-1 text-sm text-gray-300">
              Inquire about current schedules, prerequisites, and registration details.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Inquire Now
          </Link>
        </div>
      </div>
    </div>
  )
}
