import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  FileEdit,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { getDashboardStats } from '@/features/admin/queries'
import { formatDate } from '@/lib/utils'
import { ADMIN_PATH } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of courses, publication statuses, and public inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`${ADMIN_PATH}/courses/new`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Courses */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total Courses</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900">
              {stats.totalCourses}
            </span>
          </div>
        </div>

        {/* Published Courses */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Published Units</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600">
              {stats.publishedCourses}
            </span>
          </div>
        </div>

        {/* Draft Courses */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Draft Units</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileEdit className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-600">
              {stats.draftCourses}
            </span>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">New Inquiries</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-purple-600">
              {stats.unreadMessages}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Courses and Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Course Updates */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-base font-bold text-gray-900">
              Recently Updated Courses
            </h2>
            <Link
              href={`${ADMIN_PATH}/courses`}
              className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Manage all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {stats.recentCourses.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No courses created yet. Click &ldquo;New Course&rdquo; to begin.
              </p>
            ) : (
              stats.recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3.5 transition-colors hover:bg-gray-50/50 rounded-lg px-2"
                >
                  <div className="min-w-0 pr-4">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {c.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize text-gray-600 font-medium">
                        {c.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(c.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.is_published
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c.is_published ? 'Published' : 'Draft'}
                    </span>

                    <Link
                      href={`${ADMIN_PATH}/courses/${c.id}`}
                      className="inline-flex min-h-[36px] items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Administrative Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                href={`${ADMIN_PATH}/courses/new`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                <span>Create New Unit</span>
              </Link>

              <Link
                href={`${ADMIN_PATH}/courses`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Reorder Syllabus (Drag & Drop)</span>
              </Link>

              <Link
                href={`${ADMIN_PATH}/contact-submissions`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span>Review Public Inquiries</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 p-6 text-white shadow-xs">
            <Sparkles className="h-6 w-6 text-blue-200" />
            <h3 className="mt-2 font-bold text-lg">Instant Cache Invalidation</h3>
            <p className="mt-1 text-xs leading-relaxed text-blue-100">
              Any updates to courses or content immediately invalidate Next.js cache tags,
              reflecting changes on the public website within seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
