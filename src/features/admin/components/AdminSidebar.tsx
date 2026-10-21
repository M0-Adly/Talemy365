'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { logout } from '@/features/auth/actions'
import { cn } from '@/lib/utils'
import { ADMIN_PATH } from '@/lib/constants'

const ADMIN_LINKS = [
  {
    href: `${ADMIN_PATH}`,
    label: 'الرئيسية والإحصائيات',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: `${ADMIN_PATH}/courses`,
    label: 'المناهج والكورسات',
    icon: BookOpen,
    exact: false,
  },
  {
    href: `${ADMIN_PATH}/contact-submissions`,
    label: 'الرسائل الواردة',
    icon: MessageSquare,
    exact: false,
  },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="flex h-16 items-center justify-between border-b border-[#EDE7FB] bg-white px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#EDE7FB] bg-white">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-[#4C1D95]">لوحة تحكم تعلّمي</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#2D3748] hover:bg-[#EDE7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-30 flex w-64 flex-col border-l border-[#EDE7FB] bg-[#F8F5FF] transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        )}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[#EDE7FB] px-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#EDE7FB] bg-white">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="block font-black text-[#4C1D95] text-sm">تعلّمي 365</span>
              <span className="block text-[10px] font-bold text-[#7C3AED]">لوحة الإدارة</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-[#6B5B95] hover:bg-[#EDE7FB] md:hidden"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-4" aria-label="لوحة الإدارة">
          {ADMIN_LINKS.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#2D3748] hover:bg-[#EDE7FB] hover:text-[#4C1D95]'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#EDE7FB] p-4 space-y-2 bg-white">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#EDE7FB] px-4 py-2 text-xs font-bold text-[#4C1D95] hover:bg-[#EDE7FB] transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-[#7C3AED]" />
            <span>معاينة الموقع العام</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
