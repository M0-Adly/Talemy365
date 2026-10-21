import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
    title: course ? `تعديل: ${course.title}` : 'تعديل',
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
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#EDE7FB] bg-white text-[#4C1D95] hover:bg-[#EDE7FB]"
            aria-label="الرجوع للقائمة"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#4C1D95]">
              تعديل الكورس أو المنهج
            </h1>
            <p className="text-xs text-[#6B5B95] truncate max-w-md mt-1">
              {course.title}
            </p>
          </div>
        </div>
      </div>

      <CourseForm course={course} />
    </div>
  )
}
