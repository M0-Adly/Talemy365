import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CourseForm } from '@/features/courses/components/CourseForm'
import { ADMIN_PATH } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'إضافة كورس أو منهج جديد',
}

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
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
            إضافة كورس أو منهج جديد
          </h1>
          <p className="text-xs text-[#6B5B95] mt-1">
            اختر القسم (المناهج التعليمية أو الكورسات) وارفع الصورة واكتب الاسم.
          </p>
        </div>
      </div>

      <CourseForm />
    </div>
  )
}
