import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'
import { getCourse } from '@/features/courses/queries'
import { SITE_NAME } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const revalidate = 0

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
      title: 'الكورس غير موجود',
    }
  }

  return {
    title: course.title,
    description: course.description || `${course.title} - منصة ${SITE_NAME}`,
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  const categoryLabel = course.category === 'curriculum' ? 'المناهج التعليمية' : 'الكورسات'

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-[#6B5B95]"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-1.5 font-medium hover:text-[#7C3AED]"
          >
            <span>الرئيسية</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={course.category === 'curriculum' ? '/curriculum' : '/courses'}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-medium hover:text-[#7C3AED]"
          >
            <span>{categoryLabel}</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-[#4C1D95] truncate">
            {course.title}
          </span>
        </nav>

        {/* Course Card Details */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#EDE7FB] bg-white shadow-sm">
          {course.image_url && (
            <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-[#EDE7FB]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.image_url}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EDE7FB] px-3.5 py-1 text-xs font-bold text-[#6C2BD9]">
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#6B5B95]">
                <Calendar className="h-3.5 w-3.5" />
                <span>آخر تحديث: {formatDate(course.updated_at)}</span>
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-[#4C1D95] sm:text-4xl">
              {course.title}
            </h1>

            {course.description && (
              <div className="mt-6 border-t border-[#EDE7FB] pt-6">
                <h3 className="text-sm font-bold text-[#4C1D95] uppercase tracking-wider mb-2">
                  عن المحتوى:
                </h3>
                <p className="text-base leading-relaxed text-[#2D3748] whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            )}

            {/* Inquire CTA */}
            <div className="mt-10 rounded-2xl bg-[#EDE7FB] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#4C1D95]">
                  مهتم بهذا المحتوى؟
                </h3>
                <p className="text-xs text-[#6B5B95] mt-1">
                  تواصل معنا للاستفسار عن تفاصيل الحجز ومواعيد البدء.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6C2BD9]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>تواصل للاستفسار</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
