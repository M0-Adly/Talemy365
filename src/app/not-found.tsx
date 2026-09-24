import Link from 'next/link'
import { BookOpen, ArrowLeft, Home } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
        <BookOpen className="h-8 w-8" />
      </div>

      <span className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">
        404 Error
      </span>

      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-base text-gray-600 leading-relaxed">
        The unit, syllabus item, or page you were looking for does not exist or may have been
        moved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/curriculum"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Curriculum</span>
        </Link>
      </div>

      <p className="mt-12 text-xs text-gray-400">
        {SITE_NAME} Academic Portal
      </p>
    </div>
  )
}
