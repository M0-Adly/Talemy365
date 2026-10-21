import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  FileEdit,
  MessageSquare,
  Plus,
  ArrowRight,
  Mail,
  User,
  Clock,
} from 'lucide-react'
import { getDashboardStats } from '@/features/admin/queries'
import { formatDate, formatRelativeTime } from '@/lib/utils'
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
            نظرة عامة على المناهج والكورسات واستفسارات الزوار الواردة.
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
        <Link
          href={`${ADMIN_PATH}/contact-submissions`}
          className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs hover:border-[#7C3AED]/40 transition-colors block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B95]">رسائل غير مقروءة</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FB] text-[#4C1D95]">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-3xl font-black text-[#7C3AED]">
              {stats.unreadMessages}
            </span>
            <span className="text-xs font-bold text-[#7C3AED]">عرض الكل ←</span>
          </div>
        </Link>
      </div>

      {/* Grid: Recent Messages + Recent Courses */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Inquiries (رسائل واستفسارات الزوار الأخيرة) */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EDE7FB] pb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#7C3AED]" />
              <h2 className="text-base font-bold text-[#4C1D95]">
                أحدث رسائل التواصل والاستفسارات
              </h2>
            </div>
            <Link
              href={`${ADMIN_PATH}/contact-submissions`}
              className="inline-flex min-h-[40px] items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>صندوق الوارد</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#EDE7FB]">
            {stats.recentMessages.length === 0 ? (
              <div className="py-10 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-[#A78BFA]" />
                <p className="mt-2 text-sm text-[#6B5B95]">
                  لا توجد رسائل واردة حتى الآن.
                </p>
                <p className="mt-1 text-xs text-[#6B5B95]">
                  أي رسالة يرسلها الزائر عبر صفحة تواصل معنا ستظهر هنا فوراً.
                </p>
              </div>
            ) : (
              stats.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`py-3.5 rounded-xl px-3 transition-colors ${
                    msg.is_read ? 'hover:bg-[#F8F5FF]' : 'bg-[#EDE7FB]/30 hover:bg-[#EDE7FB]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE7FB] text-[#7C3AED]">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm text-[#4C1D95]">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="rounded-full bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-bold">
                          جديد
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6B5B95]">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(msg.created_at)}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#2D3748] line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs pt-1">
                    <span className="text-[#6B5B95]">{msg.email}</span>
                    <Link
                      href={`${ADMIN_PATH}/contact-submissions`}
                      className="font-bold text-[#7C3AED] hover:underline"
                    >
                      عرض الرسالة ←
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Courses / Curriculums */}
        <div className="rounded-2xl border border-[#EDE7FB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EDE7FB] pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#7C3AED]" />
              <h2 className="text-base font-bold text-[#4C1D95]">
                المناهج والكورسات المضافة
              </h2>
            </div>
            <Link
              href={`${ADMIN_PATH}/courses`}
              className="inline-flex min-h-[40px] items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#6C2BD9]"
            >
              <span>إدارة الكل</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#EDE7FB]">
            {stats.recentCourses.length === 0 ? (
              <div className="py-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-[#A78BFA]" />
                <p className="mt-2 text-sm text-[#6B5B95]">
                  سوف يتم الإعلان قريباً - لم تقم بإضافة أي محتوى بعد.
                </p>
                <Link
                  href={`${ADMIN_PATH}/courses/new`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>إضافة أول كورس أو منهج</span>
                </Link>
              </div>
            ) : (
              stats.recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3.5 transition-colors hover:bg-[#F8F5FF] rounded-xl px-2"
                >
                  <div className="min-w-0 pl-3">
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

                  <div className="flex shrink-0 items-center gap-2">
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
      </div>
    </div>
  )
}
