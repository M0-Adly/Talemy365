import Link from 'next/link'
import {
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { getCourses } from '@/features/courses/queries'
import { CourseList } from '@/features/courses/components/CourseList'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 3600

export default async function HomePage() {
  const [curriculumCourses] = await Promise.all([
    getCourses('curriculum'),
  ])

  const previewCurriculum = curriculumCourses.slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDE7FB]/70 via-[#F8F5FF] to-[#F8F5FF] py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6C2BD9] to-[#8B5CF6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#EDE7FB] px-4 py-1.5 text-xs font-semibold text-[#4C1D95] backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
              <span>A Structured Path to Mastery</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#4C1D95] sm:text-6xl lg:text-7xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#2D3748] sm:text-xl">
              An educational institution dedicated to high-standard academic and practical
              curriculums. From comprehensive foundational training to our 13 specialized
              curriculum units, we provide clear pathways for genuine advancement.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/curriculum"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#7C3AED]/25 transition-all hover:bg-[#6C2BD9] sm:w-auto"
              >
                <BookOpen className="h-5 w-5" />
                <span>Explore 13 Units</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/foundation"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#EDE7FB] bg-white px-7 py-3 text-base font-semibold text-[#4C1D95] shadow-xs transition-all hover:bg-[#EDE7FB] sm:w-auto"
              >
                <Layers className="h-5 w-5 text-[#7C3AED]" />
                <span>Foundation Course</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Values / Highlights */}
      <section className="border-y border-[#EDE7FB] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4 rounded-2xl bg-[#F8F5FF] p-6 shadow-xs border border-[#EDE7FB]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#6C2BD9]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#4C1D95]">Rigorous Pedagogy</h3>
                <p className="mt-1 text-sm text-[#2D3748] leading-relaxed">
                  Sequenced curricula designed for deep comprehension rather than superficial
                  memorization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-[#F8F5FF] p-6 shadow-xs border border-[#EDE7FB]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#7C3AED]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#4C1D95]">4-Phase Foundation</h3>
                <p className="mt-1 text-sm text-[#2D3748] leading-relaxed">
                  Structured preparatory stages ensuring core prerequisites are mastered before
                  specialization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-[#F8F5FF] p-6 shadow-xs border border-[#EDE7FB] sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#8B5CF6]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#4C1D95]">Verified Progression</h3>
                <p className="mt-1 text-sm text-[#2D3748] leading-relaxed">
                  Regular checkpoints, clear deliverables, and comprehensive material coverage
                  in every unit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Spotlight */}
      <section className="py-20 bg-[#F8F5FF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
                Main Syllabus
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-[#4C1D95] sm:text-4xl">
                Specialized Curriculum Units
              </h2>
              <p className="mt-2 max-w-2xl text-[#6B5B95]">
                Explore our dynamic units covering theoretical principles and hands-on execution.
              </p>
            </div>
            <Link
              href="/curriculum"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>View all units</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            <CourseList courses={previewCurriculum} />
          </div>
        </div>
      </section>

      {/* Foundation Course Callout Banner (Dark Background #4C1D95 to #6C2BD9) */}
      <section className="bg-gradient-to-r from-[#4C1D95] via-[#6C2BD9] to-[#7C3AED] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-[#8B5CF6]/30 px-3.5 py-1 text-xs font-semibold text-[#A78BFA] border border-[#A78BFA]/40">
              Essential Starting Point
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              The 4-Phase Foundation Course
            </h2>
            <p className="mt-4 text-lg text-[#EDE7FB] leading-relaxed">
              Before progressing into specialized units, every student completes our four-phase
              immersion designed to build bulletproof fundamentals and scholarly discipline.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
              {['Phase 1: Orientation', 'Phase 2: Core Concepts', 'Phase 3: Methods', 'Phase 4: Capstone'].map(
                (phase, idx) => (
                  <div
                    key={phase}
                    className="rounded-xl bg-white/10 p-4 backdrop-blur-xs border border-white/10"
                  >
                    <span className="text-xs font-bold text-[#A78BFA]">Stage 0{idx + 1}</span>
                    <p className="mt-1 text-sm font-semibold text-white">{phase}</p>
                  </div>
                )
              )}
            </div>

            <div className="mt-10">
              <Link
                href="/foundation"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-bold text-[#4C1D95] shadow-md transition-all hover:bg-[#EDE7FB]"
              >
                <span>Read Full Foundation Overview</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to connect */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-[#4C1D95] sm:text-4xl">
            Have questions or ready to enroll?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#6B5B95]">
            Our admissions and curriculum advisory team is always available to guide your learning
            journey.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-[#7C3AED] px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#6C2BD9]"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
