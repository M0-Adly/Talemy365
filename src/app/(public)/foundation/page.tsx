import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { getAllCoursesWithContents } from '@/features/courses/queries'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Foundation Course — 4 Phases',
  description: `The 4-phase foundational course at ${SITE_NAME}. Essential immersion designed to build solid discipline and core concepts before specialization.`,
}

export default async function FoundationPage() {
  const foundationPhases = await getAllCoursesWithContents('foundation')

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-800">
            <Layers className="h-3.5 w-3.5 text-teal-600" />
            <span>Foundational Core</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            The 4-Phase Foundation Course
          </h1>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            A comprehensive, rigorous preparatory program. Before entering advanced specialized
            units, each student navigates four distinct progressive phases designed to establish
            enduring foundations.
          </p>
        </div>

        {/* Phases Timeline / List */}
        <div className="mt-16 space-y-12">
          {foundationPhases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Layers className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                Foundation phases being organized
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Faculty is updating the phase breakdown for the upcoming term.
              </p>
            </div>
          ) : (
            foundationPhases.map((phase, idx) => (
              <div
                key={phase.id}
                className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-teal-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
                        Phase 0{idx + 1}
                      </span>
                      {phase.duration && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>{phase.duration}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                      {phase.title}
                    </h2>

                    {phase.description && (
                      <p className="mt-3 text-base leading-relaxed text-gray-600">
                        {phase.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/curriculum/${phase.id}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-800"
                    >
                      <span>Phase Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Topics / Content points */}
                {phase.course_contents && phase.course_contents.length > 0 && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Key Competencies & Topics
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {phase.course_contents.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2.5 rounded-lg bg-gray-50 p-3 text-sm text-gray-800"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Enroll CTA */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 p-8 sm:p-12 text-white text-center">
          <Sparkles className="mx-auto h-8 w-8 text-teal-300" />
          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold">
            Begin with Phase 1
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-teal-100 leading-relaxed">
            Our next foundation cohort is enrolling now. Contact us to receive the comprehensive
            orientation pack and prerequisites overview.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-bold text-teal-950 shadow-md transition-all hover:bg-teal-50"
            >
              Enroll in Foundation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
