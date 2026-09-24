'use client'

import { useState, useTransition } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  CornerDownRight,
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

    // Optimistic update
    setSubmissions((items) =>
      items.map((item) => (item.id === id ? { ...item, is_read: nextState } : item))
    )

    startTransition(async () => {
      const res = nextState ? await markAsRead(id) : await markAsUnread(id)
      if (!res.success) {
        setSubmissions(prev)
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: res.error || 'Failed to update message status.',
        })
      }
    })
  }

  const handleDelete = async (id: string) => {
    const prev = [...submissions]
    setSubmissions((items) => items.filter((item) => item.id !== id))

    const res = await deleteSubmission(id)
    if (!res.success) {
      setSubmissions(prev)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: res.error || 'Failed to delete submission.',
      })
    } else {
      addToast({
        type: 'success',
        title: 'Message Deleted',
        message: 'The submission has been removed.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1 w-fit">
        {(['all', 'unread', 'read'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`min-h-[36px] rounded-lg px-4 py-1 text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'all' && `All (${submissions.length})`}
            {tab === 'unread' &&
              `Unread (${submissions.filter((s) => !s.is_read).length})`}
            {tab === 'read' &&
              `Read (${submissions.filter((s) => s.is_read).length})`}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <Mail className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No inquiries found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {filter === 'unread'
              ? 'All incoming inquiries have been marked as read.'
              : 'Public messages submitted through the contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs transition-colors ${
                item.is_read ? 'border-gray-200' : 'border-blue-300 ring-1 ring-blue-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      item.is_read
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base">
                        {item.name}
                      </h3>
                      {!item.is_read && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span title={formatDate(item.created_at)}>
                    {formatRelativeTime(item.created_at)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="pt-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <a
                  href={`mailto:${item.email}?subject=Regarding your Taal3amy inquiry`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <CornerDownRight className="h-4 w-4" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(item.id, item.is_read)}
                    disabled={isPending}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    {item.is_read ? (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4 text-blue-600" />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>

                  <ConfirmDialog
                    title="Delete Submission"
                    description={`Are you sure you want to permanently delete this message from ${item.name}?`}
                    confirmLabel="Delete Message"
                    variant="destructive"
                    onConfirm={async () => handleDelete(item.id)}
                    trigger={
                      <button
                        type="button"
                        disabled={isPending}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete message"
                        aria-label={`Delete message from ${item.name}`}
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
