import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  FileEdit,
  MessageSquare,
  Plus,
  ArrowRight,
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
          <h1 className="text-2xl font-black tracking-tight text-[#4C1D95] sm:text-3xl">
            لوحة الإحصائيات والإدارة
          </h1>
          <p className="mt-1 text-xs text-[#6B5B95]">
            نظرة عامة على المناهج والكورسات وحالة النشر واستفسارات الزوار.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`${ADMIN_PATH}/courses/new`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#6C2BD9]"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة كورس أو منهج</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Courses */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B95]">إجمالي المحتوى</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#7C3AED]">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[#4C1D95]">
              {stats.totalCourses}
            </span>
          </div>
        </div>

        {/* Published Courses */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B95]">المنشور للجمهور</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#6C2BD9]">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[#6C2BD9]">
              {stats.publishedCourses}
            </span>
          </div>
        </div>

        {/* Draft Courses */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B95]">المسودات المخفية</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#8B5CF6]">
              <FileEdit className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[#8B5CF6]">
              {stats.draftCourses}
            </span>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B95]">رسائل واستفسارات جديدة</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#4C1D95]">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-[#4C1D95]">
              {stats.unreadMessages}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Courses and Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Course Updates */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#EDE7FB] pb-4">
            <h2 className="text-base font-bold text-[#4C1D95]">
              آخر ما تم إضافته أو تحديثه
            </h2>
            <Link
              href={`${ADMIN_PATH}/courses`}
              className="inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>إدارة الكل</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#EDE7FB]">
            {stats.recentCourses.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#6B5B95]">
                سوف يتم الإعلان قريباً - لم تقم بإضافة أي كورسات أو مناهج بعد.
              </p>
            ) : (
              stats.recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3.5 transition-colors hover:bg-[#F8F5FF] rounded-xl px-2"
                >
                  <div className="min-w-0 pl-4">
                    <p className="truncate text-sm font-bold text-[#4C1D95]">
                      {c.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#6B5B95]">
                      <span className="font-bold text-[#7C3AED]">
                        {c.category === 'curriculum' ? 'المناهج التعليمية' : 'الكورسات'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(c.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        c.is_published
                          ? 'bg-[#EDE7FB] text-[#7C3AED]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.is_published ? 'منشور' : 'مسودة'}
                    </span>

                    <Link
                      href={`${ADMIN_PATH}/courses/${c.id}`}
                      className="inline-flex min-h-[36px] items-center rounded-lg px-2.5 py-1 text-xs font-bold text-[#7C3AED] hover:bg-[#EDE7FB]"
                    >
                      تعديل
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Administrative Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-[#4C1D95]">روابط سريعة</h2>
            <div className="mt-4 space-y-2">
              <Link
                href={`${ADMIN_PATH}/courses/new`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[#EDE7FB] p-3 text-sm font-bold text-[#2D3748] hover:bg-[#EDE7FB] transition-colors"
              >
                <Plus className="h-4 w-4 text-[#7C3AED]" />
                <span>إضافة كورس أو منهج جديد</span>
              </Link>

              <Link
                href={`${ADMIN_PATH}/courses`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[#EDE7FB] p-3 text-sm font-bold text-[#2D3748] hover:bg-[#EDE7FB] transition-colors"
              >
                <BookOpen className="h-4 w-4 text-[#7C3AED]" />
                <span>ترتيب المناهج والكورسات</span>
              </Link>

              <Link
                href={`${ADMIN_PATH}/contact-submissions`}
                className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[#EDE7FB] p-3 text-sm font-bold text-[#2D3748] hover:bg-[#EDE7FB] transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-[#7C3AED]" />
                <span>مراجعة استفسارات الزوار</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
