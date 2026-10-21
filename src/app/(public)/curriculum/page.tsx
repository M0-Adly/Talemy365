import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { getCourses } from '@/features/courses/queries'
import { CourseList } from '@/features/courses/components/CourseList'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'المناهج التعليمية',
  description: `تصفح المناهج التعليمية المتاحة في ${SITE_NAME}.`,
}

export default async function CurriculumPage() {
  const courses = await getCourses('curriculum')

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE7FB] bg-[#EDE7FB] px-4 py-1.5 text-xs font-semibold text-[#4C1D95]">
            <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>المناهج التعليمية</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#4C1D95] sm:text-4xl">
            المناهج التعليمية
          </h1>

          <p className="mt-3 text-base text-[#6B5B95] leading-relaxed">
            مناهج دراسية متكاملة ومنظمة لتسهيل الفهم والمتابعة خطوة بخطوة.
          </p>
        </div>

        {/* Course Grid */}
        <div className="mt-12">
          <CourseList courses={courses} />
        </div>
      </div>
    </div>
  )
}
