import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react'
import { getCourses } from '@/features/courses/queries'
import { CourseList } from '@/features/courses/components/CourseList'

export const revalidate = 3600

export default async function HomePage() {
  const [curriculumItems, courseItems] = await Promise.all([
    getCourses('curriculum'),
    getCourses('course'),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDE7FB]/70 via-[#F8F5FF] to-[#F8F5FF] pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Banner Image Container */}
          <div className="relative mb-10 w-full overflow-hidden rounded-3xl border border-[#EDE7FB] bg-white shadow-md">
            <div className="relative aspect-[21/9] min-h-[220px] w-full sm:min-h-[340px]">
              <Image
                src="/panner.jpeg"
                alt="Talemy365 Banner"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4C1D95]/70 via-[#4C1D95]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-white">
                <span className="inline-block rounded-full bg-[#7C3AED]/80 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-white mb-3">
                  منصة تعلّمي 365
                </span>
                <h1 className="text-2xl font-black sm:text-4xl lg:text-5xl tracking-tight">
                  بوابتك للتعليم المتطور
                </h1>
              </div>
            </div>
          </div>

          {/* Intro Text & Quick Navigation */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-[#2D3748] sm:text-xl">
              منصتك التعليمية لتطوير مهاراتك خطوة بخطوة من خلال مناهج دراسية متكاملة وكورسات تدريبية عملية سهلة ومباشرة.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#curriculums"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#7C3AED]/25 transition-all hover:bg-[#6C2BD9] sm:w-auto"
              >
                <BookOpen className="h-5 w-5" />
                <span>المناهج التعليمية</span>
              </Link>

              <Link
                href="#courses"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#EDE7FB] bg-white px-7 py-3 text-base font-semibold text-[#4C1D95] shadow-xs transition-all hover:bg-[#EDE7FB] sm:w-auto"
              >
                <GraduationCap className="h-5 w-5 text-[#7C3AED]" />
                <span>الكورسات التدريبية</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: المناهج التعليمية (Curriculums) */}
      <section id="curriculums" className="py-16 sm:py-20 bg-white border-t border-[#EDE7FB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                القسم الأول
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#4C1D95] sm:text-3xl">
                المناهج التعليمية
              </h2>
              <p className="mt-1 text-sm text-[#6B5B95]">
                مناهج دراسية متكاملة لتسهيل الفهم والمتابعة خطوة بخطوة.
              </p>
            </div>

            <Link
              href="/curriculum"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>صفحة المناهج</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <CourseList courses={curriculumItems} />
        </div>
      </section>

      {/* Section 2: الكورسات (Courses) */}
      <section id="courses" className="py-16 sm:py-20 bg-[#F8F5FF] border-t border-[#EDE7FB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                القسم الثاني
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#4C1D95] sm:text-3xl">
                الكورسات
              </h2>
              <p className="mt-1 text-sm text-[#6B5B95]">
                دورات تدريبية مركزة لاكتساب المهارات العملية والتطبيقية.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>صفحة الكورسات</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <CourseList courses={courseItems} />
        </div>
      </section>

      {/* Simple Contact Callout */}
      <section className="py-16 bg-[#4C1D95] text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            هل لديك أي استفسار أو تود التواصل معنا؟
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#EDE7FB]/85">
            فريقنا متاح دائماً للإجابة على جميع تساؤلاتك ومساعدتك في اختيار ما يناسبك.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-bold text-[#4C1D95] shadow-sm hover:bg-[#EDE7FB]"
            >
              تواصل معنا الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
