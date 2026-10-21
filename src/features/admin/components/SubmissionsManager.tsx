'use client'

import { useState, useTransition } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  CornerDownRight,
  Inbox,
} from 'lucide-react'
import type { ContactSubmission } from '@/types/database'
import {
  markAsRead,
  markAsUnread,
  deleteSubmission,
} from '@/features/contact/actions'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { useToast } from '@/components/feedback/toast'
import { formatDate, formatRelativeTime } from '@/lib/utils'

interface SubmissionsManagerProps {
  initialSubmissions: ContactSubmission[]
}

export function SubmissionsManager({
  initialSubmissions,
}: SubmissionsManagerProps) {
  const [submissions, setSubmissions] =
    useState<ContactSubmission[]>(initialSubmissions)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [isPending, startTransition] = useTransition()
  const { addToast } = useToast()

  const filtered = submissions.filter((sub) => {
    if (filter === 'unread') return !sub.is_read
    if (filter === 'read') return sub.is_read
    return true
  })

  const handleToggleRead = async (id: string, current: boolean) => {
    const nextState = !current
    const prev = [...submissions]

    setSubmissions((items) =>
      items.map((item) => (item.id === id ? { ...item, is_read: nextState } : item))
    )

    startTransition(async () => {
      const res = nextState ? await markAsRead(id) : await markAsUnread(id)
      if (!res.success) {
        setSubmissions(prev)
        addToast({
          type: 'error',
          title: 'خطأ',
          message: res.error || 'فشل تحديث حالة الرسالة.',
        })
      }
    })
  }

  const handleDelete = async (id: string) => {
    const prev = [...submissions]
    setSubmissions((items) => items.filter((item) => item.id !== id))

    startTransition(async () => {
      const res = await deleteSubmission(id)
      if (!res.success) {
        setSubmissions(prev)
        addToast({
          type: 'error',
          title: 'خطأ',
          message: res.error || 'فشل حذف الرسالة.',
        })
      } else {
        addToast({
          type: 'success',
          title: 'تم الحذف',
          message: 'تم حذف الرسالة بنجاح.',
        })
      }
    })
  }

  const filters = [
    { key: 'all', label: `الكل (${submissions.length})` },
    {
      key: 'unread',
      label: `غير مقروءة (${submissions.filter((s) => !s.is_read).length})`,
    },
    {
      key: 'read',
      label: `مقروءة (${submissions.filter((s) => s.is_read).length})`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-xl bg-[#EDE7FB] p-1 w-fit">
        {filters.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as 'all' | 'unread' | 'read')}
            className={`min-h-[38px] rounded-lg px-4 py-1 text-xs font-bold transition-all ${
              filter === tab.key
                ? 'bg-white text-[#4C1D95] shadow-xs'
                : 'text-[#6B5B95] hover:text-[#4C1D95]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#EDE7FB] bg-white p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-[#A78BFA]" />
          <h3 className="mt-3 text-base font-bold text-[#4C1D95]">
            لا توجد رسائل واردة
          </h3>
          <p className="mt-1 text-xs text-[#6B5B95]">
            ستظهر هنا أي استفسارات أو رسائل يرسلها الزوار من نموذج التواصل.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs transition-colors ${
                item.is_read ? 'border-[#EDE7FB]' : 'border-[#7C3AED] ring-1 ring-[#7C3AED]/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE7FB] pb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      item.is_read
                        ? 'bg-[#EDE7FB] text-[#6B5B95]'
                        : 'bg-[#7C3AED] text-white'
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#4C1D95] text-base">
                        {item.name}
                      </h3>
                      {!item.is_read && (
                        <span className="rounded-full bg-[#EDE7FB] px-2.5 py-0.5 text-[10px] font-bold text-[#7C3AED]">
                          جديدة
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs font-semibold text-[#7C3AED] hover:underline"
                      >
                        {item.email}
                      </a>
                      {item.whatsapp && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-700" dir="ltr">
                          واتساب: {item.whatsapp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6B5B95]">
                  <Clock className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span title={formatDate(item.created_at)}>
                    {formatRelativeTime(item.created_at)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="pt-4">
                <p className="whitespace-pre-wrap text-sm text-[#2D3748] leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDE7FB] pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${item.email}?subject=بخصوص استفسارك في منصة تعلّمي 365`}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#EDE7FB] bg-white px-4 py-2 text-xs font-bold text-[#4C1D95] hover:bg-[#EDE7FB]"
                  >
                    <CornerDownRight className="h-4 w-4 text-[#7C3AED]" />
                    <span>الرد عبر البريد</span>
                  </a>

                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/${(() => {
                        let cleaned = item.whatsapp.replace(/[^0-9]/g, '');
                        if (cleaned.startsWith('01')) cleaned = '20' + cleaned.substring(1);
                        return cleaned;
                      })()}?text=${encodeURIComponent(`مرحباً ${item.name}، بخصوص استفسارك في منصة تعلّمي 365:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
                    >
                      <span>💬 رد عبر واتساب مباشرة</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(item.id, item.is_read)}
                    disabled={isPending}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-[#6B5B95] hover:bg-[#EDE7FB] transition-colors"
                  >
                    {item.is_read ? (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>تمييز كغير مقروءة</span>
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4 text-[#7C3AED]" />
                        <span>تمييز كمقروءة</span>
                      </>
                    )}
                  </button>

                  <ConfirmDialog
                    title="تأكيد حذف الرسالة"
                    description={`هل أنت متأكد من حذف رسالة ${item.name} نهائياً؟`}
                    confirmLabel="حذف نهائي"
                    variant="destructive"
                    onConfirm={async () => handleDelete(item.id)}
                    trigger={
                      <button
                        type="button"
                        disabled={isPending}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                        title="حذف الرسالة"
                        aria-label={`حذف رسالة ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
