import Link from 'next/link'
import { BookOpen, ArrowUpRight } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg w-fit"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-gray-900">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600">
              An educational institution committed to structured, rigorous, and inspiring
              learning. Empowering individuals across foundational principles and specialized
              curriculum units.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[36px] items-center text-sm text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/curriculum"
                  className="inline-flex min-h-[36px] items-center text-sm text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  Full Curriculum
                </Link>
              </li>
              <li>
                <Link
                  href="/foundation"
                  className="inline-flex min-h-[36px] items-center text-sm text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  Foundation Course
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[36px] items-center text-sm text-gray-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Transparency */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Inquiries
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Have questions regarding admissions, the curriculum, or study paths?
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
              >
                <span>Send a message</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <span className="text-xs text-gray-400">
              Designed for clarity, performance, and accessibility.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
